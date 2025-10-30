import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { processes } from "../processes/model";

export const createThread = internalQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, args) => {
    return processes.forProcess(args.processId).get(ctx.db);
  },
});

export const getChatProcess = internalQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, args) =>
    processes.forProcess(args.processId).getKind(ctx.db, "cheffy_chat"),
});

export const setChatThreadId = internalMutation({
  args: {
    processId: v.id("processes"),
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const process = await processes
      .forProcess(args.processId)
      .getKind(ctx.db, "cheffy_chat");

    await ctx.db.patch(args.processId, {
      props: {
        ...process.props,
        threadId: args.threadId,
      },
    });
    return process;
  },
});

export const clearInput = internalMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, args) => {
    const process = await processes
      .forProcess(args.processId)
      .getKind(ctx.db, "cheffy_chat");

    await ctx.db.patch(args.processId, {
      props: {
        ...process.props,
        input: undefined,
      },
    });
  },
});
