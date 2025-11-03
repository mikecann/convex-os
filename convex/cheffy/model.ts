import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import {
  DatabaseReader,
  DatabaseWriter,
  QueryCtx,
  MutationCtx,
} from "../_generated/server";
import { toggleSidebar } from "../my/cheffy";
import { processes } from "../processes/model";
import { ProcessProps } from "../processes/schema";
import { cheffyAgent } from "./agent";
import { files } from "../files/model";

export const cheffy = {
  forProcess(processId: Id<"processes">) {
    return {
      get(db: DatabaseReader) {
        return processes.forProcess(processId).getKind(db, "cheffy_chat");
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
        if (process.props.threadId) return process.props.threadId;

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
            const file = await files.forFile(fileId).getUploaded(db);

            if (file.uploadState.kind !== "uploaded")
              throw new Error("File is not uploaded");

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
    };
  },
};
