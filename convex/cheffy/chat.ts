import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { cheffyAgent } from "./agent";
import { myAction } from "../lib";
import { iife } from "../../shared/misc";

export const sendMessage = myAction({
  args: {
    processId: v.id("processes"),
    text: v.string(),
    attachments: v.array(v.id("files")),
  },
  handler: async (ctx, args) => {
    const process = await ctx.runQuery(
      internal.internal.cheffy.getChatProcess,
      {
        processId: args.processId,
      },
    );

    if (process.kind != "cheffy_chat") throw new Error("Process not cheffy");

    const threadId = await iife(async () => {
      if (process.props.threadId) return process.props.threadId;
      const result = await cheffyAgent.createThread(ctx, {
        userId: ctx.userId,
      });
      await ctx.runMutation(internal.internal.cheffy.setChatThreadId, {
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

    await ctx.runMutation(internal.internal.cheffy.clearInput, {
      processId: args.processId,
    });
  },
});
