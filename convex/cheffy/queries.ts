import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getProcess = internalQuery({
  args: {
    processId: v.id("processes"),
  },
  returns: v.union(
    v.object({
      _id: v.id("processes"),
      _creationTime: v.number(),
      userId: v.id("users"),
      kind: v.literal("cheffy_chat"),
      props: v.object({
        threadId: v.optional(v.string()),
        input: v.optional(
          v.object({
            text: v.string(),
            attachments: v.array(v.id("files")),
          }),
        ),
      }),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const process = await ctx.db.get(args.processId);
    if (!process || process.kind !== "cheffy_chat") return null;
    return process;
  },
});
