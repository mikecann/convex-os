import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const clearInput = internalMutation({
  args: {
    processId: v.id("processes"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const process = await ctx.db.get(args.processId);
    if (!process || process.kind !== "cheffy_chat")
      throw new Error("Process not found or not a cheffy_chat process");

    await ctx.db.patch(args.processId, {
      props: {
        ...process.props,
        input: undefined,
      },
    });

    return null;
  },
});
