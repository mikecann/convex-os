import { v } from "convex/values";
import { myMutation, myQuery } from "../lib";
import { files } from "../files/model";

export const list = myQuery({
  args: {},
  handler: (ctx) => files.forUser(ctx.userId).list(ctx.db),
});

export const get = myQuery({
  args: {
    fileId: v.id("files"),
  },
  handler: (ctx, { fileId }) =>
    files.forUser(ctx.userId).forFile(fileId).get(ctx.db),
});

export const find = myQuery({
  args: {
    fileId: v.id("files"),
  },
  handler: (ctx, { fileId }) =>
    files.forUser(ctx.userId).forFile(fileId).find(ctx.db),
});

export const createAll = myMutation({
  args: {
    files: v.array(
      v.object({
        name: v.string(),
        size: v.number(),
        type: v.string(),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
      }),
    ),
  },
  handler: async (ctx, args) =>
    files.forUser(ctx.userId).createAll(ctx.db, { files: args.files }),
});

export const startUpload = myMutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, { fileId }) =>
    files.forUser(ctx.userId).forFile(fileId).startUpload(ctx),
});

export const updateUploadProgress = myMutation({
  args: {
    fileId: v.id("files"),
    progress: v.number(),
  },
  handler: async (ctx, { fileId, progress }) =>
    files
      .forUser(ctx.userId)
      .forFile(fileId)
      .updateUploadProgress(ctx.db, { progress }),
});

export const completeUpload = myMutation({
  args: {
    fileId: v.id("files"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { fileId, storageId }) =>
    files
      .forUser(ctx.userId)
      .forFile(fileId)
      .completeUpload(ctx, { storageId }),
});

export const setUploadError = myMutation({
  args: {
    fileId: v.id("files"),
    message: v.string(),
  },
  handler: async (ctx, { fileId, message }) =>
    files
      .forUser(ctx.userId)
      .forFile(fileId)
      .setUploadError(ctx.db, { message }),
});

export const updatePosition = myMutation({
  args: {
    fileId: v.id("files"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  handler: async (ctx, { fileId, position }) =>
    files
      .forUser(ctx.userId)
      .forFile(fileId)
      .updatePosition(ctx.db, { position }),
});

export const updatePositions = myMutation({
  args: {
    updates: v.array(
      v.object({
        fileId: v.id("files"),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
      }),
    ),
  },
  handler: async (ctx, { updates }) => {
    await files.forUser(ctx.userId).updatePositions(ctx.db, { updates });
    return null;
  },
});

export const rename = myMutation({
  args: {
    fileId: v.id("files"),
    name: v.string(),
  },
  handler: async (ctx, { fileId, name }) =>
    files.forUser(ctx.userId).forFile(fileId).rename(ctx.db, { name }),
});

export const deleteAll = myMutation({
  args: {
    fileIds: v.array(v.id("files")),
  },
  handler: async (ctx, { fileIds }) =>
    files.forUser(ctx.userId).deleteAll(ctx, { fileIds }),
});
