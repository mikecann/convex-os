import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "../_generated/server";
import { api, internal } from "../_generated/api";
import { cheffyAgent } from "./agent";
import { listUIMessages } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";
import { myQuery, myAction } from "../lib";
import { processes } from "../processes/model";
import { iife } from "../../shared/misc";

export const sendMessage = myAction({
  args: {
    processId: v.id("processes"),
    text: v.string(),
    attachments: v.array(v.id("files")),
  },
  handler: async (ctx, args) => {
    const process = await ctx.runQuery(internal.cheffy.chat.getChatProcess, {
      processId: args.processId,
    });

    if (process.kind != "cheffy_chat") throw new Error("Process not cheffy");

    const threadId = await iife(async () => {
      if (process.props.threadId) return process.props.threadId;
      const result = await cheffyAgent.createThread(ctx, {
        userId: ctx.userId,
      });
      await ctx.runMutation(internal.cheffy.chat.setChatThreadId, {
        processId: args.processId,
        threadId,
      });
      return result.threadId;
    });

    const messageParts: Array<{
      type: string;
      text?: string;
      data?: string;
      mimeType?: string;
    }> = [];

    if (args.text.trim()) messageParts.push({ type: "text", text: args.text });

    for (const fileId of args.attachments) {
      const file = await ctx.runQuery(api.my.files.get, { fileId });
      if (file?.uploadState.kind === "uploaded") {
        const fileUrl = await ctx.storage.getUrl(file.uploadState.storageId);
        if (fileUrl && file.type.startsWith("image/"))
          messageParts.push({
            type: "image",
            data: fileUrl,
            mimeType: file.type,
          });
      }
    }

    await cheffyAgent.generateText(ctx, { threadId }, { prompt: args.text });

    await ctx.runMutation(internal.cheffy.mutations.clearInput, {
      processId: args.processId,
    });
  },
});

export const listThreadMessages = myQuery({
  args: { threadId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await listUIMessages(ctx, components.agent, args);
  },
});

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

export const listThreads = myQuery({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.runQuery(
      components.agent.threads.listThreadsByUserId,
      {
        userId: ctx.userId,
        order: "desc",
        paginationOpts: args.paginationOpts,
      },
    );
  },
});