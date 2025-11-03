import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";
import { components } from "../_generated/api";
import { processes } from "../processes/model";
import { cheffyAgent } from "../cheffy/agent";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

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

export const generateResponseAsync = cheffyAgent.asTextAction({});

export const generateThreadTitleAsync = internalAction({
  args: { threadId: v.string() },
  returns: v.null(),
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.runQuery(components.agent.threads.getThread, {
      threadId,
    });

    if (!thread) return null;

    if (thread.title) return null;

    const messagesResult = await ctx.runQuery(
      components.agent.messages.listMessagesByThreadId,
      {
        threadId,
        order: "asc",
        excludeToolMessages: true,
        paginationOpts: { numItems: 10, cursor: null },
      },
    );

    if (messagesResult.page.length === 0) return null;

    const messagesText = messagesResult.page
      .map((msg) => {
        if (!msg.message) return "";
        const content = msg.message.content;
        if (typeof content === "string") return content;
        if (Array.isArray(content))
          return content
            .map((part) => {
              if (typeof part === "string") return part;
              if (part.type === "text") return part.text;
              return "";
            })
            .join(" ");
        return "";
      })
      .filter((text) => text.length > 0)
      .join("\n");

    if (!messagesText.trim()) return null;

    const { text: title } = await generateText({
      model: openai.chat("gpt-5-mini"),
      prompt: `Based on the following conversation, generate a concise title (maximum 6 words). Only return the title, nothing else:\n\n${messagesText}`,
    });

    if (title.trim())
      await ctx.runMutation(components.agent.threads.updateThread, {
        threadId,
        patch: { title: title.trim() },
      });

    return null;
  },
});
