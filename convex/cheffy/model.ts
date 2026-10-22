import { components, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import {
  DatabaseReader,
  DatabaseWriter,
  QueryCtx,
  MutationCtx,
} from "../_generated/server";
import { saveMessage } from "@convex-dev/agent";
import { toggleSidebar } from "../my/cheffy";
import { processes } from "../processes/model";
import { ProcessProps } from "../processes/schema";
import { cheffyAgent } from "./agent";
import { files } from "../files/model";
import { ConvexError } from "convex/values";
import {
  CHEFFY_LIMITS,
  consumeDailyBudget,
  replyProviderOptions,
} from "./limits";

export const ensureThreadOwnership = async (
  ctx: QueryCtx,
  threadId: string,
  userId: Id<"users">,
  { allowMissing = false }: { allowMissing?: boolean } = {},
) => {
  const thread = await ctx.runQuery(components.agent.threads.getThread, {
    threadId,
  });
  if (!thread && allowMissing) return null;
  if (!thread || thread.userId !== userId)
    throw new ConvexError(`thread ${threadId} does not belong to you`);
  return thread;
};

export const cheffy = {
  forProcess(processId: Id<"processes">) {
    return {
      get(db: DatabaseReader) {
        return processes.forProcess(processId).getKind(db, "cheffy_chat");
      },

      async ensureOwnership(db: DatabaseReader, userId: Id<"users">) {
        await processes.forProcess(processId).withUser(userId).get(db);
        return this.get(db);
      },

      async findCurrentThread(ctx: QueryCtx) {
        const process = await this.get(ctx.db);
        if (!process.props.threadId) return null;
        const thread = await ctx.runQuery(components.agent.threads.getThread, {
          threadId: process.props.threadId,
        });
        return thread;
      },

      async getCurrentThread(ctx: QueryCtx) {
        const thread = await this.findCurrentThread(ctx);
        if (!thread) throw new Error("Thread not found");
        return thread;
      },

      async patchProps(
        db: DatabaseWriter,
        props: Partial<ProcessProps<"cheffy_chat">>,
      ) {
        const process = await this.get(db);
        await db.patch(processId, {
          props: {
            ...process.props,
            ...props,
          },
        });
      },

      async patchSidebar(
        db: DatabaseWriter,
        props: Partial<ProcessProps<"cheffy_chat">["sidebar"]>,
      ) {
        const process = await this.get(db);
        await db.patch(processId, {
          props: {
            ...process.props,
            sidebar: {
              ...process.props.sidebar,
              ...props,
            },
          },
        });
      },

      async patchInput(
        db: DatabaseWriter,
        props: {
          text?: string;
          attachments?: Id<"files">[];
        },
      ) {
        const process = await this.get(db);
        await db.patch(processId, {
          props: {
            ...process.props,
            input: {
              text: props.text ?? process.props.input?.text ?? "",
              attachments:
                props.attachments ?? process.props.input?.attachments ?? [],
            },
          },
        });
      },

      async toggleSidebar(db: DatabaseWriter) {
        const process = await this.get(db);
        await db.patch(processId, {
          props: {
            ...process.props,
            sidebar: {
              ...process.props.sidebar,
              isOpen: !process.props.sidebar.isOpen,
            },
          },
        });
      },

      async addAttachment(db: DatabaseWriter, fileId: Id<"files">) {
        const process = await this.get(db);
        const currentAttachments = process.props.input?.attachments ?? [];

        if (!currentAttachments.includes(fileId))
          await this.patchInput(db, {
            attachments: [...currentAttachments, fileId],
          });
      },

      async removeAttachment(db: DatabaseWriter, fileId: Id<"files">) {
        const process = await this.get(db);
        const currentAttachments = process.props.input?.attachments ?? [];
        const newAttachments = currentAttachments.filter((id) => id !== fileId);

        await this.patchInput(db, {
          attachments: newAttachments,
        });
      },

      async shouldGenerateTitle(ctx: QueryCtx, threadId: string) {
        const thread = await ctx.runQuery(components.agent.threads.getThread, {
          threadId,
        });
        if (!thread) return false;
        if (!thread.title) return true;
        return false;
      },

      async hasMessageInProgress(ctx: QueryCtx, threadId: string) {
        const messages = await ctx.runQuery(
          components.agent.messages.listMessagesByThreadId,
          {
            threadId,
            order: "desc",
            paginationOpts: { numItems: 1, cursor: null },
            statuses: ["pending"],
          },
        );

        return messages.page.length > 0;
      },

      async getOrCreateThreadId(
        ctx: MutationCtx,
        userId: Id<"users">,
      ): Promise<string> {
        const process = await this.get(ctx.db);
        if (process.props.threadId) {
          // The thread id is client-writable via process props, so never trust
          // it: only reuse a thread that exists and belongs to this user.
          const thread = await ctx.runQuery(
            components.agent.threads.getThread,
            { threadId: process.props.threadId },
          );
          if (thread && thread.userId === userId) return thread._id;
          if (thread)
            throw new ConvexError(
              `thread ${process.props.threadId} does not belong to you`,
            );
        }

        const result = await cheffyAgent.createThread(ctx, {
          userId,
        });
        await this.patchProps(ctx.db, {
          threadId: result.threadId,
        });
        return result.threadId;
      },

      async convertAttachmentsToContent(
        db: DatabaseReader,
        userId: Id<"users">,
        fileIds: Id<"files">[],
      ): Promise<
        Array<
          | { type: "image"; image: string }
          | { type: "text"; text: string }
          | { type: "file"; data: string; mediaType: string }
        >
      > {
        return Promise.all(
          fileIds.map(async (fileId) => {
            const file = await files.forUser(userId).forFile(fileId).get(db);

            if (file.uploadState.kind !== "uploaded")
              throw new Error("File is not uploaded");

            // Use the real stored size, not the client-declared one.
            const stored = await db.system.get(file.uploadState.storageId);
            if (!stored || stored.size > CHEFFY_LIMITS.maxAttachmentBytes)
              throw new ConvexError(
                `Attachments must be under ${CHEFFY_LIMITS.maxAttachmentBytes / 1024 / 1024}MB`,
              );

            const url = file.uploadState.url;

            if (file.type.startsWith("image/"))
              return {
                type: "image" as const,
                image: url,
              };

            if (file.type.startsWith("text/"))
              return {
                type: "text" as const,
                text: url,
              };

            return {
              type: "file" as const,
              data: url,
              mediaType: file.type,
            };
          }),
        );
      },

      async sendMessage(ctx: MutationCtx, userId: Id<"users">) {
        const process = await this.ensureOwnership(ctx.db, userId);

        const text = process.props.input?.text?.trim();
        if (!text) throw new Error("No text in input");
        if (text.length > CHEFFY_LIMITS.maxInputChars)
          throw new ConvexError(
            `Messages must be ${CHEFFY_LIMITS.maxInputChars} characters or fewer`,
          );

        const attachments = process.props.input?.attachments ?? [];
        if (attachments.length > CHEFFY_LIMITS.maxAttachments)
          throw new ConvexError(
            `You can attach up to ${CHEFFY_LIMITS.maxAttachments} files`,
          );

        const threadId = await this.getOrCreateThreadId(ctx, userId);

        if (await this.hasMessageInProgress(ctx, threadId))
          throw new Error(
            "Cannot send message while another message is in progress",
          );

        const attachmentsContent = await this.convertAttachmentsToContent(
          ctx.db,
          userId,
          attachments,
        );

        // Last check before anything paid is scheduled. Throwing here rolls
        // back the whole mutation, so nothing is saved or scheduled.
        await consumeDailyBudget(ctx.db, userId);

        const { messageId } = await saveMessage(ctx, components.agent, {
          threadId,
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

        if (attachments.length > 0)
          await ctx.db.insert("cheffyMessageMetadata", {
            messageId,
            userId,
            fileIds: attachments,
          });

        await ctx.scheduler.runAfter(
          0,
          internal.internal.cheffy.generateResponseAsync,
          {
            threadId,
            promptMessageId: messageId,
            providerOptions: replyProviderOptions,
          },
        );

        if (await this.shouldGenerateTitle(ctx, threadId))
          await ctx.scheduler.runAfter(
            0,
            internal.internal.cheffy.generateThreadTitleAsync,
            { threadId },
          );

        await this.patchInput(ctx.db, {
          text: "",
          attachments: [],
        });
      },
    };
  },
};
