import { ConvexError, v } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter, query } from "../_generated/server";
import { Process, processesTable } from "./schema";

export const processes = {
  find: (db: DatabaseReader, { processId }: { processId: Id<"processes"> }) =>
    db.get(processId),

  get: (db: DatabaseReader, { processId }: { processId: Id<"processes"> }) =>
    processes
      .find(db, { processId })
      .then(ensureFP(`could not find process ${processId}`)),

  getForUser: async (
    db: DatabaseReader,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ) => {
    const process = await processes.get(db, { processId });
    if (process.userId !== userId)
      throw new ConvexError(
        `process ${processId} does not belong to user ${userId}`,
      );
    return process;
  },

  listForUser: (db: DatabaseReader, { userId }: { userId: Id<"users"> }) =>
    db
      .query("processes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect(),

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
