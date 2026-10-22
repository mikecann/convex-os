import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { files } from "../files/model";

export const checkUploadTarget = internalQuery({
  args: { fileId: v.id("files"), token: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { fileId, token }) =>
    !!(await files.forUpload(fileId, token).find(ctx.db)),
});

export const completeUpload = internalMutation({
  args: {
    fileId: v.id("files"),
    token: v.string(),
    storageId: v.id("_storage"),
  },
  returns: v.boolean(),
  handler: async (ctx, { fileId, token, storageId }) =>
    files.forUpload(fileId, token).complete(ctx, { storageId }),
});
