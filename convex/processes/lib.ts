import { ConvexError, Infer } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter } from "../_generated/server";
import { Process, processCreationValidator } from "./schema";
import { windows } from "../windows/lib";

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

      async findName(db: DatabaseReader) {
        const wins = await windows.forProcess(processId).list(db);
        if (wins.length === 0) return null;
        return wins[0].title;
      },

      async delete(db: DatabaseWriter) {
        await db.delete(processId);
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

          updateProps: async (db: DatabaseWriter, { props }: { props: Process["props"] }) => {
            await db.patch(processId, { props });
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

      async findActive(db: DatabaseReader) {
        const activeWindow = await windows.forUser(userId).findActive(db);
        if (!activeWindow) return null;
        return await windows.forWindow(activeWindow._id).getProcess(db);
      },

      async create(
        db: DatabaseWriter,
        { process }: { process: Infer<typeof processCreationValidator> },
      ) {
        return await db.insert("processes", {
          userId,
          kind: process.kind,
          props: process.props,
        });
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
