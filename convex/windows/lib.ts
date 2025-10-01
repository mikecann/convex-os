import { ensureFP } from "../../shared/ensure";
import { Doc, Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter } from "../_generated/server";
import { processes } from "../processes/lib";
import { WindowCreationParams } from "./schema";

export const windows = {
  sortByViewStackOrder(windows: Doc<"windows">[]) {
    return windows.sort((a, b) => {
      const aState = a.viewState;
      const bState = b.viewState;

      const aIsOpen = aState.kind === "open";
      const bIsOpen = bState.kind === "open";

      if (aIsOpen && bIsOpen)
        return aState.viewStackOrder - bState.viewStackOrder;

      if (aIsOpen) return 1;

      if (bIsOpen) return -1;

      return a._creationTime - b._creationTime;
    });
  },

  forWindow(windowId: Id<"windows">) {
    return {
      find(db: DatabaseReader) {
        return db.get(windowId);
      },

      get(db: DatabaseReader) {
        return this.find(db).then(ensureFP(`could not get window ${windowId}`));
      },

      async getProcess(db: DatabaseReader) {
        const window = await this.get(db);
        const process = await processes.forProcess(window.processId).get(db);
        return process;
      },

      async getWithProcess(db: DatabaseReader) {
        const window = await this.get(db);
        const process = await processes.forProcess(window.processId).get(db);
        return { window, process };
      },

      async getUserId(db: DatabaseReader) {
        const process = await this.getProcess(db);
        return process.userId;
      },

      async minimize(db: DatabaseWriter) {
        const window = await this.get(db);
        if (window.viewState.kind !== "open") return;
        return await db.patch(window._id, {
          ...window,
          viewState: { kind: "minimized" },
        });
      },

      async updatePosition(
        db: DatabaseWriter,
        {
          position,
          size,
        }: {
          position: { x: number; y: number };
          size?: { width: number; height: number };
        },
      ) {
        const window = await this.get(db);
        const updates: {
          x: number;
          y: number;
          width?: number;
          height?: number;
        } = { x: position.x, y: position.y };
        if (size) {
          updates.width = size.width;
          updates.height = size.height;
        }
        return await db.patch(window._id, updates);
      },

      async activate(db: DatabaseWriter) {
        const { window, process } = await this.getWithProcess(db);

        const active = await windows
          .forUser(process.userId)
          .findActiveWithProcess(db);

        if (active) {
          // If window is already active, do nothing
          if (active.process._id === process._id) return;

          // Deactivate the active window
          await windows.forWindow(active.window._id).deactivate(db);
        }

        // Activate
        return await db.patch(window._id, {
          ...window,
          viewState: {
            kind: "open",
            isActive: true,
            viewStackOrder: 0,
          },
        });
      },

      async deactivate(db: DatabaseWriter) {
        const window = await this.get(db);
        if (window.viewState.kind !== "open") return;
        if (!window.viewState.isActive) return;
        return await db.patch(window._id, {
          ...window,
          viewState: { ...window.viewState, kind: "open", isActive: false },
        });
      },

      async bringToFront(db: DatabaseWriter) {
        const window = await this.get(db);
        if (window.viewState.kind !== "open") return;

        const userId = await this.getUserId(db);

        const topmostViewStackOrder = await windows
          .forUser(userId)
          .getTopmostViewStackOrder(db);

        return await db.patch(window._id, {
          ...window,
          viewState: {
            ...window.viewState,
            kind: "open",
            isActive: true,
            viewStackOrder: topmostViewStackOrder + 1,
          },
        });
      },

      async focus(db: DatabaseWriter) {
        await this.activate(db);
        await this.bringToFront(db);
      },
    };
  },

  forProcess(processId: Id<"processes">) {
    return {
      async list(db: DatabaseReader) {
        return db
          .query("windows")
          .withIndex("by_processId", (q) => q.eq("processId", processId))
          .collect()
          .then(windows.sortByViewStackOrder);
      },

      create: async (
        db: DatabaseWriter,
        { params }: { params: WindowCreationParams },
      ) => {
        return await db.insert("windows", {
          processId,
          ...params,
        });
      },
    };
  },

  forUser(userId: Id<"users">) {
    return {
      async list(db: DatabaseReader): Promise<Doc<"windows">[]> {
        const procs = await processes.forUser(userId).list(db);
        return Promise.all(
          procs.map(async (proc) => {
            return await windows.forProcess(proc._id).list(db);
          }),
        )
          .then((windows) => windows.flat())
          .then(windows.sortByViewStackOrder);
      },

      async findActive(db: DatabaseReader) {
        const windows = await this.list(db);
        return windows.find(
          (window) =>
            window.viewState.kind === "open" && window.viewState.isActive,
        );
      },

      async findActiveWithProcess(db: DatabaseReader) {
        const window = await this.findActive(db);
        if (!window) return null;
        const process = await processes.forProcess(window.processId).get(db);
        return { window, process };
      },

      async getTopmostViewStackOrder(db: DatabaseReader) {
        const windows = await this.list(db);
        return windows.reduce((max, window) => {
          return Math.max(
            max,
            window.viewState.kind === "open"
              ? window.viewState.viewStackOrder
              : 0,
          );
        }, 0);
      },
    };
  },
};
