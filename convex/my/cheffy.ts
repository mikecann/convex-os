import { Infer, v } from "convex/values";
import {
  listUIMessages,
  saveMessage,
  vUserMessage,
  vStreamArgs,
  syncStreams,
} from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";
import { myMutation, myQuery } from "../lib";
import { processes } from "../processes/model";
import { cheffy } from "../cheffy/model";
import { cheffyAgent } from "../cheffy/agent";
import { iife } from "../../shared/misc";
import { files } from "../files/model";
import { MessageContentParts } from "../../node_modules/@convex-dev/agent/src/validators";

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
    const process = await cheffy.forProcess(args.processId).get(ctx.db);

    const text = process.props.input?.text;
    if (!text) throw new Error("No text in input");

    const threadId = await iife(async () => {
      if (process.props.threadId) return process.props.threadId;
      const result = await cheffyAgent.createThread(ctx, {
        userId: ctx.userId,
      });
      await cheffy.forProcess(args.processId).patchProps(ctx.db, {
        threadId: result.threadId,
      });
      return result.threadId;
    });

    const attachments = process.props.input?.attachments ?? [];
    const attachmentsContent = await Promise.all(
      attachments.map(async (fileId) => {
        const file = await files.forFile(fileId).getUploaded(ctx.db);

        if (file.uploadState.kind !== "uploaded")
          throw new Error("File is not uploaded");

        if (file.type.startsWith("image/"))
          return {
            type: "image" as const,
            image: file.uploadState.url,
          };

        if (file.type.startsWith("text/"))
          return {
            type: "text" as const,
            text: file.uploadState.url,
          };

        return {
          type: "file" as const,
          data: file.uploadState.url,
          mediaType: file.type,
        };
      }),
    );

    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId,
      metadata: {},
      message: {
        role: "user",
        content: [
          ...attachmentsContent,
          {
            type: "text",
            text,
          },
        ],
      },
    });

    await ctx.scheduler.runAfter(
      0,
      internal.internal.cheffy.generateResponseAsync,
      {
        threadId,
        promptMessageId: messageId,
      },
    );

    if (
      await cheffy.forProcess(args.processId).shouldGenerateTitle(ctx, threadId)
    )
      await ctx.scheduler.runAfter(
        0,
        internal.internal.cheffy.generateThreadTitleAsync,
        { threadId },
      );

    await cheffy.forProcess(args.processId).patchInput(ctx.db, {
      text: "",
      attachments: [],
    });
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
