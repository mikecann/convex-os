import { components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter, QueryCtx } from "../_generated/server";
import { toggleSidebar } from "../my/cheffy";
import { processes } from "../processes/model";
import { ProcessProps } from "../processes/schema";

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
    };
  },
};
