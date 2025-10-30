import { v } from "convex/values";
import { listUIMessages } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";
import { myMutation, myQuery } from "../lib";
import { internalMutation } from "../_generated/server";
import { processes } from "../processes/model";

export const listThreadMessages = myQuery({
  args: { threadId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await listUIMessages(ctx, components.agent, args);
  },
});

export const listThreads = myQuery({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId: ctx.userId,
      order: "desc",
      paginationOpts: args.paginationOpts,
    });
  },
});

export const setThreadId = myMutation({
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
  },
});
