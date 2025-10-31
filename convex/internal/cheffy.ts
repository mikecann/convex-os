import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { processes } from "../processes/model";
import { vv } from "../lib";
import { cheffyAgent } from "../cheffy/agent";

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

export const sendMessage = internalAction({
  args: {
    threadId: v.string(),
    text: v.string(),
    attachments: v.array(
      v.union(
        v.object({
          type: v.literal("image"),
          image: v.string(),
        }),
        v.object({
          type: v.literal("file"),
          data: v.string(),
          mediaType: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, { attachments, text, threadId }) => {
    // const messageParts: Array<{
    //   type: string;
    //   text?: string;
    //   data?: string;
    //   mimeType?: string;
    // }> = [];

    // if (text) messageParts.push({ type: "text", text });

    // for (const fileId of attachments) {
    //   const file = await ctx.runQuery(api.my.files.get, { fileId });
    //   if (file?.uploadState.kind === "uploaded") {
    //     const fileUrl = await ctx.storage.getUrl(file.uploadState.storageId);
    //     if (fileUrl && file.type.startsWith("image/"))
    //       messageParts.push({
    //         type: "image",
    //         data: fileUrl,
    //         mimeType: file.type,
    //       });
    //   }
    // }

    await cheffyAgent.generateText(
      ctx,
      { threadId },
      {
        messages: [
          {
            role: "user",
            content: [
              ...attachments,
              {
                type: "text",
                text,
              },
            ],
          },
        ],
      },
    );

    // await ctx.runMutation(internal.internal.cheffy.clearInput, {
    //   processId: args.processId,
    // });
  },
});
