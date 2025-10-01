import { ConvexError, v } from "convex/values";
import { userMutation, userQuery } from "../lib";
import { processes } from "../processes/lib";
import {
  Process,
  processValidator,
  windowViewStateValidator,
  windowValidator,
  ProcessWithWindow,
} from "../processes/schema";
import { isNotNullOrUndefined } from "../../shared/filter";

export const list = userQuery({
  args: {},
  handler: async (ctx) => {
    return processes.listForUser(ctx.db, {
      userId: ctx.userId,
    });
    // return userProcesses.sort((a, b) => {
    //   const aOrder =
    //     a.window?.kind === "open" || a.window?.kind === "maximized"
    //       ? a.window.viewStackOrder
    //       : -1;
    //   const bOrder =
    //     b.window?.kind === "open" || b.window?.kind === "maximized"
    //       ? b.window.viewStackOrder
    //       : -1;
    //   return aOrder - bOrder;
    // });
  },
});

export const listProcessWithWindows = userQuery({
  args: {},
  handler: async (ctx): Promise<ProcessWithWindow[]> => {
    const procs = await processes.listForUser(ctx.db, {
      userId: ctx.userId,
    });
    return procs
      .filter((p) => {
        if (!p.window) return null;
        return p as ProcessWithWindow;
      })
      .filter(isNotNullOrUndefined) as ProcessWithWindow[];
  },
});

export const activeProcessId = userQuery({
  args: {},
  handler: async (ctx) => {
    return processes.findActiveForUser(ctx.db, {
      userId: ctx.userId,
    });
  },
});

export const minimize = userMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, { processId }) => {
    return processes.minimizeForUser(ctx.db, {
      userId: ctx.userId,
      processId,
    });
  },
});

export const focus = userMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, { processId }) => {
    
  },
});

// export const create = userMutation({
//   args: {
//     name: v.string(),
//     kind: v.union(
//       v.literal("image_preview"),
//       v.literal("video_preview"),
//       v.literal("sign_in_sign_up"),
//     ),
//     window: v.optional(
//       v.object({
//         position: v.object({ x: v.number(), y: v.number() }),
//         size: v.object({ width: v.number(), height: v.number() }),
//       }),
//     ),
//     // Props for specific kinds, all optional for simplicity in `create`
//     props: v.optional(
//       v.object({
//         file: v.id("files"),
//       }),
//     ),
//   },
//   handler: async (ctx, args) => {
//     const maxViewStackOrder = await processes.getMaxViewStackOrder(ctx.db, {
//       userId: ctx.userId,
//     });

//     const processData: Omit<Process, "_id" | "_creationTime" | "props"> & {
//       props?: { file: any };
//     } = {
//       userId: ctx.userId,
//       name: args.name,
//       kind: args.kind,
//       ...(args.window
//         ? {
//             window: {
//               kind: "open" as const,
//               ...args.window,
//               viewStackOrder: maxViewStackOrder + 1,
//             },
//           }
//         : {}),
//     };

//     if (args.kind === "image_preview" || args.kind === "video_preview") {
//       if (!args.props?.file) {
//         throw new ConvexError("File ID is required for this process kind");
//       }
//       processData.props = { file: args.props.file };
//     }

//     return await ctx.db.insert("processes", processData as any);
//   },
// });

// export const close = userMutation({
//   args: {
//     processId: v.id("processes"),
//   },
//   handler: async (ctx, { processId }) => {
//     const process = await processes.getForUser(ctx.db, {
//       userId: ctx.userId,
//       processId,
//     });

//     await ctx.db.delete(processId);

//     if (
//       process.window?.kind === "open" ||
//       process.window?.kind === "maximized"
//     ) {
//       const processesToRenumber = await processes.getProcessesToRenumber(
//         ctx.db,
//         {
//           userId: ctx.userId,
//           aboveViewStackOrder: process.window.viewStackOrder,
//         },
//       );

//       for (const p of processesToRenumber) {
//         if (p.window?.kind === "open" || p.window?.kind === "maximized") {
//           await ctx.db.patch(p._id, {
//             window: {
//               ...p.window,
//               viewStackOrder: p.window.viewStackOrder - 1,
//             },
//           });
//         }
//       }
//     }
//   },
// });

// export const focus = userMutation({
//   args: {
//     processId: v.id("processes"),
//   },
//   handler: async (ctx, { processId }) => {
//     const process = await processes.getForUser(ctx.db, {
//       userId: ctx.userId,
//       processId,
//     });

//     if (!process.window) {
//       throw new ConvexError(`Process ${processId} has no window to focus`);
//     }

//     if (process.window.kind === "minimized") {
//       throw new ConvexError(`Cannot focus a minimized window`);
//     }

//     const maxViewStackOrder = await processes.getMaxViewStackOrder(ctx.db, {
//       userId: ctx.userId,
//     });

//     if (process.window.viewStackOrder === maxViewStackOrder) {
//       // already focused
//       return;
//     }

//     const oldViewStackOrder = process.window.viewStackOrder;

//     await ctx.db.patch(processId, {
//       window: {
//         ...process.window,
//         viewStackOrder: maxViewStackOrder,
//       },
//     });

//     const processesToRenumber = await processes.getProcessesToRenumber(ctx.db, {
//       userId: ctx.userId,
//       aboveViewStackOrder: oldViewStackOrder,
//     });

//     for (const p of processesToRenumber) {
//       if (
//         (p.window?.kind === "open" || p.window?.kind === "maximized") &&
//         p._id !== processId
//       ) {
//         await ctx.db.patch(p._id, {
//           window: {
//             ...p.window,
//             viewStackOrder: p.window.viewStackOrder - 1,
//           },
//         });
//       }
//     }
//   },
// });

// export const updateWindow = userMutation({
//   args: {
//     processId: v.id("processes"),
//     position: v.object({ x: v.number(), y: v.number() }),
//     size: v.object({ width: v.number(), height: v.number() }),
//   },
//   handler: async (ctx, { processId, position, size }) => {
//     const process = await processes.getForUser(ctx.db, {
//       userId: ctx.userId,
//       processId,
//     });
//     if (!process.window || process.window.kind !== "open") {
//       throw new ConvexError(
//         `Can't update window for process ${processId} in state ${
//           process.window?.kind ?? "unknown"
//         }`,
//       );
//     }
//     await ctx.db.patch(processId, {
//       window: {
//         ...process.window,
//         position,
//         size,
//       },
//     });
//   },
// });

// export const minimize = userMutation({
//   args: {
//     processId: v.id("processes"),
//   },
//   handler: async (ctx, { processId }) => {
//     const process = await processes.getForUser(ctx.db, {
//       userId: ctx.userId,
//       processId,
//     });

//     if (!process.window) return;
//     if (process.window.kind === "minimized") return;

//     const oldViewStackOrder = process.window.viewStackOrder;
//     const preMinimizedState = { ...process.window };

//     await ctx.db.patch(processId, {
//       window: {
//         kind: "minimized",
//       },
//       restoredState: preMinimizedState,
//     } as any);

//     const processesToRenumber = await processes.getProcessesToRenumber(ctx.db, {
//       userId: ctx.userId,
//       aboveViewStackOrder: oldViewStackOrder,
//     });

//     for (const p of processesToRenumber) {
//       if (p.window?.kind === "open" || p.window?.kind === "maximized") {
//         await ctx.db.patch(p._id, {
//           window: {
//             ...p.window,
//             viewStackOrder: p.window.viewStackOrder - 1,
//           },
//         });
//       }
//     }
//   },
// });

// export const maximize = userMutation({
//   args: {
//     processId: v.id("processes"),
//   },
//   handler: async (ctx, { processId }) => {
//     const process = await processes.getForUser(ctx.db, {
//       userId: ctx.userId,
//       processId,
//     });
//     if (!process.window || process.window.kind !== "open") {
//       throw new ConvexError(
//         `Cannot maximize window for process ${processId} in state ${process.window?.kind}`,
//       );
//     }

//     const maxViewStackOrder = await processes.getMaxViewStackOrder(ctx.db, {
//       userId: ctx.userId,
//     });

//     const oldViewStackOrder = process.window.viewStackOrder;

//     await ctx.db.patch(processId, {
//       window: {
//         kind: "maximized",
//         restored: {
//           x: process.window.position.x,
//           y: process.window.position.y,
//           width: process.window.size.width,
//           height: process.window.size.height,
//         },
//         viewStackOrder: maxViewStackOrder,
//       },
//     });

//     const processesToRenumber = await processes.getProcessesToRenumber(ctx.db, {
//       userId: ctx.userId,
//       aboveViewStackOrder: oldViewStackOrder,
//     });

//     for (const p of processesToRenumber) {
//       if (
//         (p.window?.kind === "open" || p.window?.kind === "maximized") &&
//         p._id !== processId
//       ) {
//         await ctx.db.patch(p._id, {
//           window: {
//             ...p.window,
//             viewStackOrder: p.window.viewStackOrder - 1,
//           },
//         });
//       }
//     }
//   },
// });

// export const restore = userMutation({
//   args: {
//     processId: v.id("processes"),
//   },
//   handler: async (ctx, { processId }) => {
//     const process = await processes.getForUser(ctx.db, {
//       userId: ctx.userId,
//       processId,
//     });

//     if (!process.window || process.window.kind === "open") return;

//     const maxViewStackOrder = await processes.getMaxViewStackOrder(ctx.db, {
//       userId: ctx.userId,
//     });

//     if (process.window.kind === "minimized") {
//       const restored = (process as any).restoredState;
//       await ctx.db.patch(processId, {
//         window: {
//           kind: "open",
//           position: restored?.position ?? { x: 50, y: 50 },
//           size: restored?.size ?? { width: 400, height: 300 },
//           viewStackOrder: maxViewStackOrder + 1,
//         },
//       });
//       return;
//     }

//     // Restoring from maximized
//     await ctx.db.patch(processId, {
//       window: {
//         kind: "open",
//         position: {
//           x: process.window.restored.x,
//           y: process.window.restored.y,
//         },
//         size: {
//           width: process.window.restored.width,
//           height: process.window.restored.height,
//         },
//         viewStackOrder: maxViewStackOrder + 1,
//       },
//     });
//   },
// });
