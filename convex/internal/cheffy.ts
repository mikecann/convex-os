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
        v.object({
          type: v.literal("text"),
          text: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, { attachments, text, threadId }) => {
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
  },
});
