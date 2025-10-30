import { v } from "convex/values";
import { listUIMessages } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";
import { myMutation, myQuery } from "../lib";
import { processes } from "../processes/model";
import { cheffy } from "../cheffy/lib";

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
  handler: async (ctx, args) =>
    cheffy.forProcess(args.processId).patchProps(ctx.db, {
      threadId: args.threadId,
    }),
});

export const toggleSidebar = myMutation({
  args: {
    processId: v.id("processes"),
  },
  returns: v.null(),
  handler: async (ctx, args) =>
    cheffy.forProcess(args.processId).toggleSidebar(ctx.db),
});

export const setSidebarWidth = myMutation({
  args: {
    processId: v.id("processes"),
    width: v.number(),
  },
  handler: async (ctx, args) =>
    cheffy.forProcess(args.processId).patchSidebar(ctx.db, {
      width: args.width,
    }),
});

export const updateText = myMutation({
  args: {
    processId: v.id("processes"),
    text: v.string(),
  },
  handler: async (ctx, args) =>
    cheffy.forProcess(args.processId).patchInput(ctx.db, {
      text: args.text,
    }),
});

export const sendMessage = myMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, args) => {
    const process = await processes
      .forProcess(args.processId)
      .getKind(ctx.db, "cheffy_chat");
  },
});
