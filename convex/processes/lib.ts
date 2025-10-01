import { ConvexError, Infer, v } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter, query } from "../_generated/server";
import {
  Process,
  processesTable,
  processValidator,
  ProcessWithWindow,
} from "./schema";
import { isNotNullOrUndefined } from "../../shared/filter";

export const processes = {
  forProcess(processId: Id<"processes">) {
    return {
      find(db: DatabaseReader) {
        return db.get(processId);
      },

      get(db: DatabaseReader) {
        return this.find(db).then(
          ensureFP(`could not find process ${processId}`),
        );
      },

      withUser(userId: Id<"users">) {
        const withUser = {
          get: async (db: DatabaseReader) => {
            const process = await processes.forProcess(processId).get(db);
            if (process.userId !== userId)
              throw new ConvexError(
                `process ${processId} does not belong to user ${userId}`,
              );
            return process;
          },

          findWithWindow: async (
            db: DatabaseReader,
          ): Promise<ProcessWithWindow | null> => {
            const process = await withUser.get(db);
            if (!process.window) return null;
            return process as ProcessWithWindow;
          },

          getWithWindow: async (
            db: DatabaseReader,
          ): Promise<ProcessWithWindow> => {
            const process = await withUser.findWithWindow(db);
            if (!process)
              throw new Error(
                `process ${processId} does not belong to user ${userId} or doesnt have a window`,
              );
            return process;
          },

          minimize: async (db: DatabaseWriter) => {
            const proc = await withUser.get(db);
            if (!proc.window) return;
            if (proc.window.viewState.kind !== "open") return;
            return await db.patch(processId, {
              window: { ...proc.window, viewState: { kind: "minimized" } },
            });
          },

          deactivate: async (db: DatabaseWriter) => {
            const proc = await withUser.findWithWindow(db);
            if (!proc) return;
            return await db.patch(processId, {
              window: { ...proc.window, viewState: { kind: "minimized" } },
            });
          },

          activate: async (db: DatabaseWriter) => {
            const active = await processes.forUser(userId).findActive(db);

            // If window is already active, do nothing
            if (active?._id === processId) return;

            const proc = await withUser.getWithWindow(db);

            if (proc.window.viewState.kind !== "open") return;

            return await db.patch(processId, {
              window: {
                ...proc.window,
                viewState: {
                  ...proc.window.viewState,
                  kind: "open",
                  isActive: true,
                },
              },
            });
          },

          bringToFront: async (db: DatabaseWriter) => {
            const proc = await withUser.getWithWindow(db);
            if (proc.window.viewState.kind !== "open") return;
            return await db.patch(processId, {
              window: {
                ...proc.window,
                viewState: {
                  ...proc.window.viewState,
                  kind: "open",
                  isActive: true,
                  viewStackOrder: proc.window.viewState.viewStackOrder + 1,
                },
              },
            });
          },

          focus: async (db: DatabaseWriter) => {
            await withUser.activate(db);
            await withUser.bringToFront(db);
          },

          create: async (
            db: DatabaseWriter,
            { process }: { process: Process },
          ) => {
            return await db.insert("processes", { ...process, userId });
          },
        };

        return withUser;
      },
    };
  },

  forUser(userId: Id<"users">) {
    return {
      list(db: DatabaseReader) {
        return db
          .query("processes")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect()
          .then((docs) =>
            docs.sort((a, b) => {
              const aState = a.window?.viewState;
              const bState = b.window?.viewState;

              const aIsOpen = aState?.kind === "open";
              const bIsOpen = bState?.kind === "open";

              if (aIsOpen && bIsOpen)
                return bState.viewStackOrder - aState.viewStackOrder;

              if (aIsOpen) return -1;

              if (bIsOpen) return 1;

              return b._creationTime - a._creationTime;
            }),
          );
      },

      async listWithWindows(db: DatabaseReader) {
        const procs = await this.list(db);
        return procs
          .filter((p) => {
            if (!p.window) return null;
            return p as ProcessWithWindow;
          })
          .filter(isNotNullOrUndefined) as ProcessWithWindow[];
      },

      async findActive(
        db: DatabaseReader,
      ): Promise<ProcessWithWindow | undefined> {
        const procs = await this.listWithWindows(db);
        return procs.find(
          (p) =>
            p.window?.viewState.kind == "open" && p.window?.viewState.isActive,
        );
      },

      create: async (
        db: DatabaseWriter,
        { process }: { process: Infer<typeof processValidator> },
      ) => {
        const processId = await db.insert("processes", { ...process, userId });
        return processId;
      },
    };
  },

  // async getWindows(db: DatabaseReader, { userId }: { userId: Id<"users"> }) {
  //   const allProcesses = await processes.listForUser(db, { userId });
  //   return allProcesses.filter(
  //     (p): p is Process & { window: NonNullable<Process["window"]> } =>
  //       !!p.window,
  //   );
  // },

  // async getMaxViewStackOrder(
  //   db: DatabaseReader,
  //   { userId }: { userId: Id<"users"> },
  // ): Promise<number> {
  //   const windows = await processes.getWindows(db, { userId });
  //   return windows.reduce((max, p) => {
  //     if (p.window.kind === "open" || p.window.kind === "maximized") {
  //       return Math.max(max, p.window.viewStackOrder);
  //     }
  //     return max;
  //   }, -1);
  // },

  // async getProcessesToRenumber(
  //   db: DatabaseReader,
  //   {
  //     userId,
  //     aboveViewStackOrder,
  //   }: { userId: Id<"users">; aboveViewStackOrder: number },
  // ) {
  //   const windows = await processes.getWindows(db, { userId });
  //   return windows.filter(
  //     (p) =>
  //       (p.window.kind === "open" || p.window.kind === "maximized") &&
  //       p.window.viewStackOrder > aboveViewStackOrder,
  //   );
  // },
};
