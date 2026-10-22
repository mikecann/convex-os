import { ConvexError, Infer, v } from "convex/values";
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
import { QueryCtx } from "../_generated/server";
import { processes } from "../processes/model";
import { cheffy, ensureThreadOwnership } from "../cheffy/model";
import { CHEFFY_LIMITS } from "../cheffy/limits";
import { cheffyAgent } from "../cheffy/agent";
import { files } from "../files/model";

const assertInputLength = (text: string) => {
  if (text.length > CHEFFY_LIMITS.maxInputChars)
    throw new ConvexError(
      `Messages must be ${CHEFFY_LIMITS.maxInputChars} characters or fewer`,
    );
};

type StreamArgs = Infer<typeof vStreamArgs>;

const emptyStreams = (streamArgs: StreamArgs) => {
  if (!streamArgs) return undefined;
  return streamArgs.kind === "list"
    ? { kind: "list" as const, messages: [] }
    : { kind: "deltas" as const, deltas: [] };
};

// The agent's listDeltas looks deltas up by stream ID alone, so a caller
// could pair their own thread with someone else's stream ID. Only forward
// cursors for streams the component says belong to this thread.
const ownStreamArgs = async (
  ctx: QueryCtx,
  threadId: string,
  streamArgs: StreamArgs,
): Promise<StreamArgs> => {
  if (!streamArgs || streamArgs.kind === "list") return streamArgs;
  if (streamArgs.cursors.length === 0) return streamArgs;
  const threadStreams = await ctx.runQuery(components.agent.streams.list, {
    threadId,
    statuses: ["streaming", "finished", "aborted"],
  });
  const ownIds = new Set(threadStreams.map((s) => s.streamId));
  return {
    kind: "deltas",
    cursors: streamArgs.cursors.filter((c) => ownIds.has(c.streamId)),
  };
};

export const listThreadMessages = myQuery({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    // A deleted thread just lists as empty, as before.
    const thread = await ensureThreadOwnership(ctx, args.threadId, ctx.userId, {
      allowMissing: true,
    });
    if (!thread)
      return {
        page: [],
        isDone: true,
        continueCursor: "",
        streams: emptyStreams(args.streamArgs),
      };
    const paginated = await listUIMessages(ctx, components.agent, args);
    const streams = await syncStreams(ctx, components.agent, {
      threadId: thread._id,
      streamArgs: await ownStreamArgs(ctx, thread._id, args.streamArgs),
    });
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
    await ensureThreadOwnership(ctx, message.threadId, ctx.userId);

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
  handler: async (ctx, args) => {
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
    await ensureThreadOwnership(ctx, args.threadId, ctx.userId);
    await cheffy.forProcess(args.processId).patchProps(ctx.db, {
      threadId: args.threadId,
    });
  },
});

export const toggleSidebar = myMutation({
  args: {
    processId: v.id("processes"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
    await cheffy.forProcess(args.processId).toggleSidebar(ctx.db);
    return null;
  },
});

export const setSidebarWidth = myMutation({
  args: {
    processId: v.id("processes"),
    width: v.number(),
  },
  handler: async (ctx, args) => {
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
    await cheffy.forProcess(args.processId).patchSidebar(ctx.db, {
      width: args.width,
    });
  },
});

export const updateText = myMutation({
  args: {
    processId: v.id("processes"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    assertInputLength(args.text);
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
    await cheffy.forProcess(args.processId).patchInput(ctx.db, {
      text: args.text,
    });
  },
});

export const sendMessage = myMutation({
  args: {
    processId: v.id("processes"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    assertInputLength(args.text);
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
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
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
    await files
      .forUser(ctx.userId)
      .forFile(args.fileId)
      .ensureOwnership(ctx.db);
    await cheffy.forProcess(args.processId).addAttachment(ctx.db, args.fileId);
  },
});

export const removeAttachment = myMutation({
  args: {
    processId: v.id("processes"),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
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
    await cheffy.forProcess(args.processId).ensureOwnership(ctx.db, ctx.userId);
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
    const process = await cheffy
      .forProcess(args.processId)
      .ensureOwnership(ctx.db, ctx.userId);
    await ensureThreadOwnership(ctx, args.threadId, ctx.userId);

    await cheffyAgent.deleteThreadAsync(ctx, { threadId: args.threadId });

    if (process.props.threadId === args.threadId)
      await cheffy.forProcess(args.processId).patchProps(ctx.db, {
        threadId: undefined,
      });
  },
});
