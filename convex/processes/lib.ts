import { ConvexError, v } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter, query } from "../_generated/server";
import { Process, processesTable, ProcessWithWindow } from "./schema";
import { isNotNullOrUndefined } from "../../shared/filter";

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

  findWithWindowForUser: async (
    db: DatabaseReader,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ): Promise<ProcessWithWindow | null> => {
    const process = await processes.getForUser(db, { userId, processId });
    if (!process.window) return null;
    return process as ProcessWithWindow;
  },

  getWithWindowForUser: async (
    db: DatabaseReader,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ): Promise<ProcessWithWindow> => {
    const process = await processes.findWithWindowForUser(db, {
      userId,
      processId,
    });
    if (!process)
      throw new Error(
        `process ${processId} does not belong to user ${userId} or doesnt have a window`,
      );
    return process;
  },

  listForUser: (db: DatabaseReader, { userId }: { userId: Id<"users"> }) =>
    db
      .query("processes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
      .then((docs) =>
        docs.sort(
          (a, b) => {
         
          }            
        ),
      ),

  listForUserWithWindows: async (
    db: DatabaseReader,
    { userId }: { userId: Id<"users"> },
  ) => {
    const procs = await processes.listForUser(db, { userId });
    return procs
      .filter((p) => {
        if (!p.window) return null;
        return p as ProcessWithWindow;
      })
      .filter(isNotNullOrUndefined) as ProcessWithWindow[];
  },

  findActiveForUser: async (
    db: DatabaseReader,
    { userId }: { userId: Id<"users"> },
  ): Promise<ProcessWithWindow | undefined> => {
    const procs = await processes.listForUserWithWindows(db, { userId });
    return procs.find(
      (p) => p.window?.viewState.kind == "open" && p.window?.viewState.isActive,
    );
  },

  minimizeForUser: async (
    db: DatabaseWriter,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ) => {
    const proc = await processes.getForUser(db, {
      userId,
      processId,
    });
    if (!proc.window) return;
    if (proc.window.viewState.kind !== "open") return;
    return await db.patch(processId, {
      window: { ...proc.window, viewState: { kind: "minimized" } },
    });
  },

  deactivateForUser: async (
    db: DatabaseWriter,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ) => {
    const proc = await processes.findWithWindowForUser(db, {
      userId,
      processId,
    });
    if (!proc) return;
    return await db.patch(processId, {
      window: { ...proc.window, viewState: { kind: "minimized" } },
    });
  },

  activateForUser: async (
    db: DatabaseWriter,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ) => {
    const active = await processes.findActiveForUser(db, { userId });

    // If window is already active, do nothing
    if (active?._id === processId) return;

    const proc = await processes.getWithWindowForUser(db, {
      userId,
      processId,
    });

    if (proc.window.viewState.kind !== "open") return;

    return await db.patch(processId, {
      window: {
        ...proc.window,
        viewState: { ...proc.window.viewState, kind: "open", isActive: true },
      },
    });
  },

  bringToFrontForUser: async (
    db: DatabaseWriter,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ) => {
    const proc = await processes.getWithWindowForUser(db, {
      userId,
      processId,
    });
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

  focusForUser: async (
    db: DatabaseWriter,
    { userId, processId }: { userId: Id<"users">; processId: Id<"processes"> },
  ) => {
    await processes.activateForUser(db, { userId, processId });
    await processes.bringToFrontForUser(db, { userId, processId });
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
