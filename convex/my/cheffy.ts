import { Infer, v } from "convex/values";
import {
  listUIMessages,
  vUserMessage,
  vStreamArgs,
  syncStreams,
  Message,
  storeFile,
  getFile,
} from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";
import { myMutation, myQuery } from "../lib";
import { processes } from "../processes/model";
import { cheffy } from "../cheffy/model";
import { cheffyAgent } from "../cheffy/agent";
import { files } from "../files/model";

export const listThreadMessages = myQuery({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const paginated = await listUIMessages(ctx, components.agent, args);
    const streams = await syncStreams(ctx, components.agent, args);
    return { ...paginated, streams };
  },
});

export const getMessageMetadata = myQuery({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const metadata = await ctx.db
      .query("cheffyMessageMetadata")
      .withIndex("by_messageId", (q) => q.eq("messageId", args.messageId))
      .first();

    if (!metadata || metadata.userId !== ctx.userId) return null;

    return metadata;
  },
});

export const getMessageError = myQuery({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.runQuery(
      components.agent.messages.getMessagesByIds,
      {
        messageIds: [args.messageId],
      },
    );

    const message = messages[0];
    if (!message) return null;

    return message.error ?? null;
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
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await cheffy.forProcess(args.processId).patchInput(ctx.db, {
      text: args.text,
    });
    await cheffy.forProcess(args.processId).sendMessage(ctx, ctx.userId);
  },
});

export const addAttachment = myMutation({
  args: {
    processId: v.id("processes"),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    await cheffy.forProcess(args.processId).addAttachment(ctx.db, args.fileId);
  },
});

export const removeAttachment = myMutation({
  args: {
    processId: v.id("processes"),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    await cheffy
      .forProcess(args.processId)
      .removeAttachment(ctx.db, args.fileId);
  },
});

export const createThread = myMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, args) => {
    const result = await cheffyAgent.createThread(ctx, {
      userId: ctx.userId,
    });
    await cheffy.forProcess(args.processId).patchProps(ctx.db, {
      threadId: result.threadId,
    });
    return result.threadId;
  },
});

export const deleteThread = myMutation({
  args: {
    processId: v.id("processes"),
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const process = await cheffy.forProcess(args.processId).get(ctx.db);

    await cheffyAgent.deleteThreadAsync(ctx, { threadId: args.threadId });

    if (process.props.threadId === args.threadId)
      await cheffy.forProcess(args.processId).patchProps(ctx.db, {
        threadId: undefined,
      });
  },
});
