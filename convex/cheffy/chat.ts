import { v } from "convex/values";
import { action, query } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { cheffyAgent } from "./agent";
import { listUIMessages } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";

export const sendMessage = action({
  args: {
    processId: v.id("processes"),
    text: v.string(),
    attachments: v.array(v.id("files")),
  },
  returns: v.array(
    v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number(),
    }),
  ),
  handler: async (
    ctx,
    args,
  ): Promise<Array<{ role: string; content: string; timestamp: number }>> => {
    const process = await ctx.runQuery(internal.cheffy.queries.getProcess, {
      processId: args.processId,
    });

    if (!process) throw new Error("Process not found");

    let threadId: string | undefined = process.props.threadId;
    let thread;

    if (threadId) {
      const result = await cheffyAgent.continueThread(ctx, { threadId });
      thread = result.thread;
    } else {
      const result = await cheffyAgent.createThread(ctx);
      threadId = result.threadId;
      thread = result.thread;

      await ctx.runMutation(internal.cheffy.mutations.updateThreadId, {
        processId: args.processId,
        threadId,
      });
    }

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

    const result = await thread.generateText({
      prompt: args.text,
    });

    await ctx.runMutation(internal.cheffy.mutations.clearInput, {
      processId: args.processId,
    });

    // Return a simplified version - just the user message and agent response
    return [
      {
        role: "user",
        content: args.text,
        timestamp: Date.now(),
      },
      {
        role: "assistant",
        content: result.text,
        timestamp: Date.now(),
      },
    ];
  },
});

export const listThreadMessages = query({
  args: { threadId: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await listUIMessages(ctx, components.agent, args);
  },
});
