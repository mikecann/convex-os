import { ConvexError, Infer } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter } from "../_generated/server";
import {
  Process,
  processCreationValidator,
  processStartingValidator,
  processValidator,
} from "./schema";
import { windows } from "../windows/lib";
import { exhaustiveCheck } from "../../shared/misc";

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

      async minimize(db: DatabaseWriter) {
        const wins = await windows.forProcess(processId).list(db);
        for (const window of wins)
          await windows.forWindow(window._id).minimize(db);
      },

      async focus(db: DatabaseWriter) {
        const wins = await windows.forProcess(processId).list(db);
        if (wins.length === 0) return;
        for (const window of wins)
          await windows.forWindow(window._id).focus(db);
      },

      async centerOnScreen(
        db: DatabaseWriter,
        {
          desktopWidth,
          desktopHeight,
        }: { desktopWidth: number; desktopHeight: number },
      ) {
        const wins = await windows.forProcess(processId).list(db);
        for (const window of wins)
          await windows
            .forWindow(window._id)
            .centerOnScreen(db, { desktopWidth, desktopHeight });
      },

      async findName(db: DatabaseReader) {
        const wins = await windows.forProcess(processId).list(db);
        if (wins.length === 0) return null;
        return wins[0].title;
      },

      async delete(db: DatabaseWriter) {
        await db.delete(processId);
      },

      async close(db: DatabaseWriter) {
        const wins = await windows.forProcess(processId).list(db);

        for (const window of wins)
          await windows.forWindow(window._id).delete(db);

        await this.delete(db);
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

          create: async (
            db: DatabaseWriter,
            { process }: { process: Process },
          ) => {
            return await db.insert("processes", { ...process, userId });
          },

          updateProps: async (
            db: DatabaseWriter,
            { props }: { props: Process["props"] },
          ) => {
            const patch: Record<string, typeof props> = { props };
            await db.patch(processId, patch);
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
          .collect();
      },

      async listWithWindows(db: DatabaseReader) {
        const procs = await this.list(db);
        return await Promise.all(
          procs.map(async (proc) => {
            const wins = await windows.forProcess(proc._id).list(db);
            return { process: proc, windows: wins };
          }),
        );
      },

      async findActive(db: DatabaseReader) {
        const activeWindow = await windows.forUser(userId).findActive(db);
        if (!activeWindow) return null;
        return await windows.forWindow(activeWindow._id).getProcess(db);
      },

      async create(
        db: DatabaseWriter,
        { process }: { process: Infer<typeof processCreationValidator> },
      ) {
        const toInsert = {
          userId,
          kind: process.kind,
          props: process.props,
        } as Infer<typeof processValidator>;
        return await db.insert("processes", toInsert);
      },

      async start(
        db: DatabaseWriter,
        { process }: { process: Infer<typeof processStartingValidator> },
      ) {
        const processId = await this.create(db, {
          process: process,
        });

        if (process.kind === "image_preview") {
          const windowId = await windows.forProcess(processId).create(db, {
            params: {
              ...process.windowCreationParams,
              viewState: { kind: "open", viewStackOrder: 0, isActive: false },
            },
          });
          await windows.forWindow(windowId).focus(db);
        } else if (process.kind === "video_player") {
          const windowId = await windows.forProcess(processId).create(db, {
            params: {
              ...process.windowCreationParams,
              viewState: { kind: "open", viewStackOrder: 0, isActive: false },
            },
          });
          await windows.forWindow(windowId).focus(db);
        } else if (process.kind === "text_preview") {
          const windowId = await windows.forProcess(processId).create(db, {
            params: {
              ...process.windowCreationParams,
              viewState: { kind: "open", viewStackOrder: 0, isActive: false },
            },
          });
          await windows.forWindow(windowId).focus(db);
        } else if (process.kind === "cheffy_chat") {
          const windowId = await windows.forProcess(processId).create(db, {
            params: {
              ...process.windowCreationParams,
              viewState: { kind: "open", viewStackOrder: 0, isActive: false },
            },
          });
          await windows.forWindow(windowId).focus(db);
        } else if (process.kind === "file_browser") {
          const windowId = await windows.forProcess(processId).create(db, {
            params: {
              ...process.windowCreationParams,
              viewState: { kind: "open", viewStackOrder: 0, isActive: false },
            },
          });
          await windows.forWindow(windowId).focus(db);
        } else exhaustiveCheck(process);

        return processId;
      },
    };
  },
};
