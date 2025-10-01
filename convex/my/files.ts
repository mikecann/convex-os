import { ConvexError, v } from "convex/values";
import { userMutation, userQuery } from "../lib";
import { files } from "../files/lib";
import { clamp } from "../../shared/num";

export const list = userQuery({
  args: {},
  handler: (ctx) => files.listForUser(ctx.db, { userId: ctx.userId }),
});

export const get = userQuery({
  args: {
    fileId: v.id("files"),
  },
  handler: (ctx, { fileId }) => files.getForUser(ctx.db, { userId: ctx.userId, fileId }),
});

export const createAll = userMutation({
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
  handler: async (ctx, args) => {
    return Promise.all(
      args.files.map((f) => files.create(ctx.db, { userId: ctx.userId, ...f })),
    );
  },
});

export const startUpload = userMutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, { fileId }) => {
    const file = await files.getForUser(ctx.db, {
      userId: ctx.userId,
      fileId,
    });

    if (file.uploadState.kind != "created")
      throw new ConvexError(`File ${fileId} is not in a created state`);

    const uploadUrl = await ctx.storage.generateUploadUrl();

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "uploading",
        progress: 0,
        uploadUrl,
      },
    });

    return { uploadUrl };
  },
});

export const updateUploadProgress = userMutation({
  args: {
    fileId: v.id("files"),
    progress: v.number(),
  },
  handler: async (ctx, { fileId, progress }) => {
    const file = await files.getForUser(ctx.db, {
      userId: ctx.userId,
      fileId,
    });

    if (file.uploadState.kind != "uploading")
      throw new ConvexError(`File ${fileId} is not in a uploading state`);

    await ctx.db.patch(fileId, {
      uploadState: {
        ...file.uploadState,
        progress: clamp(progress, 0, 100),
      },
    });
  },
});

export const completeUpload = userMutation({
  args: {
    fileId: v.id("files"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { fileId, storageId }) => {
    const file = await files.getForUser(ctx.db, {
      userId: ctx.userId,
      fileId,
    });

    if (file.uploadState.kind != "uploading")
      throw new ConvexError(`File ${fileId} is not in a uploading state`);

    const url = await ctx.storage.getUrl(storageId);
    if (!url)
      throw new ConvexError(
        `Download URL for storageId '${storageId}' could not be generated`,
      );

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "uploaded",
        storageId,
        url,
      },
    });
  },
});

export const setUploadError = userMutation({
  args: {
    fileId: v.id("files"),
    message: v.string(),
  },

  handler: async (ctx, { fileId, message }) => {
    const file = await files.getForUser(ctx.db, {
      userId: ctx.userId,
      fileId,
    });

    if (file.uploadState.kind != "uploading")
      throw new ConvexError(`File ${fileId} is not in a uploading state`);

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "errored",
        message,
      },
    });
  },
});

export const updatePosition = userMutation({
  args: {
    fileId: v.id("files"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  handler: async (ctx, { fileId, position }) => {
    await files.ensureUserOwnsFile(ctx.db, {
      userId: ctx.userId,
      fileId,
    });
    await ctx.db.patch(fileId, { position });
  },
});

export const rename = userMutation({
  args: {
    fileId: v.id("files"),
    name: v.string(),
  },
  handler: async (ctx, { fileId, name }) => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0)
      throw new ConvexError(
        `File name for '${fileId}' could not be updated because the provided name is empty`,
      );

    await files.ensureUserOwnsFile(ctx.db, {
      userId: ctx.userId,
      fileId,
    });

    await ctx.db.patch(fileId, { name: trimmedName });
  },
});

export const deleteAll = userMutation({
  args: {
    fileIds: v.array(v.id("files")),
  },
  handler: async (ctx, { fileIds }) => {
    for (const fileId of fileIds) {
      const file = await files.getForUser(ctx.db, {
        userId: ctx.userId,
        fileId,
      });

      if (file.uploadState.kind === "uploaded")
        await ctx.storage.delete(file.uploadState.storageId);

      await ctx.db.delete(fileId);
    }
  },
});
