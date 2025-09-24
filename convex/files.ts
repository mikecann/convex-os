import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

export const listDesktopFiles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const files = await ctx.db
      .query("files")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return files;
  },
});

export const generateDesktopUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createDesktopFiles = mutation({
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
  returns: v.array(v.id("files")),
  handler: async (ctx, { files }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const insertedIds = [];
    for (const file of files) {
      const id = await ctx.db.insert("files", {
        userId,
        ...file,
        uploadState: { kind: "created" as const },
      });
      insertedIds.push(id);
    }

    return insertedIds;
  },
});

export const startDesktopUpload = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, { fileId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const file = await ctx.db.get(fileId);
    if (!file)
      throw new ConvexError(
        `File with id '${fileId}' for userId '${userId}' could not be found`,
      );
    if (file.userId !== userId)
      throw new ConvexError(
        `File '${fileId}' does not belong to userId '${userId}'`,
      );

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "uploading" as const,
        progress: 0,
      },
    });

    return {
      uploadState: {
        kind: "uploading" as const,
        progress: 0,
      },
    };
  },
});

export const updateDesktopUploadProgress = mutation({
  args: {
    fileId: v.id("files"),
    progress: v.number(),
  },
  handler: async (ctx, { fileId, progress }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const file = await ctx.db.get(fileId);
    if (!file)
      throw new ConvexError(
        `File with id '${fileId}' for userId '${userId}' could not be found`,
      );
    if (file.userId !== userId)
      throw new ConvexError(
        `File '${fileId}' does not belong to userId '${userId}'`,
      );

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "uploading" as const,
        progress,
      },
    });

    return {
      uploadState: {
        kind: "uploading" as const,
        progress,
      },
    };
  },
});

export const completeDesktopUpload = mutation({
  args: {
    fileId: v.id("files"),
    storageId: v.id("_storage"),
  },
  returns: v.object({
    uploadState: v.object({
      kind: v.literal("uploaded"),
      storageId: v.id("_storage"),
      url: v.string(),
    }),
  }),

  handler: async (ctx, { fileId, storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const file = await ctx.db.get(fileId);
    if (!file)
      throw new ConvexError(
        `File with id '${fileId}' for userId '${userId}' could not be found`,
      );
    if (file.userId !== userId)
      throw new ConvexError(
        `File '${fileId}' does not belong to userId '${userId}'`,
      );

    const url = await ctx.storage.getUrl(storageId);
    if (!url)
      throw new ConvexError(
        `Download URL for storageId '${storageId}' could not be generated`,
      );

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "uploaded" as const,
        storageId,
        url,
      },
    });

    return {
      uploadState: {
        kind: "uploaded" as const,
        storageId,
        url,
      },
    };
  },
});

export const setDesktopUploadError = mutation({
  args: {
    fileId: v.id("files"),
    message: v.string(),
  },
  returns: v.object({
    uploadState: v.object({
      kind: v.literal("errored"),
      message: v.string(),
    }),
  }),

  handler: async (ctx, { fileId, message }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const file = await ctx.db.get(fileId);
    if (!file)
      throw new ConvexError(
        `File with id '${fileId}' for userId '${userId}' could not be found`,
      );
    if (file.userId !== userId)
      throw new ConvexError(
        `File '${fileId}' does not belong to userId '${userId}'`,
      );

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "errored" as const,
        message,
      },
    });

    return {
      uploadState: {
        kind: "errored" as const,
        message,
      },
    };
  },
});

export const updateDesktopFilePosition = mutation({
  args: {
    fileId: v.id("files"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  returns: v.object({
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  }),

  handler: async (ctx, { fileId, position }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const file = await ctx.db.get(fileId);
    if (!file)
      throw new ConvexError(
        `File with id '${fileId}' for userId '${userId}' could not be found`,
      );
    if (file.userId !== userId)
      throw new ConvexError(
        `File '${fileId}' does not belong to userId '${userId}'`,
      );

    await ctx.db.patch(fileId, { position });

    return {
      position,
    };
  },
});

export const deleteDesktopFiles = mutation({
  args: {
    fileIds: v.array(v.id("files")),
  },
  returns: v.null(),
  handler: async (ctx, { fileIds }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    for (const fileId of fileIds) {
      const file = await ctx.db.get(fileId);
      if (!file)
        throw new ConvexError(
          `File with id '${fileId}' for userId '${userId}' could not be found`,
        );
      if (file.userId !== userId)
        throw new ConvexError(
          `File '${fileId}' does not belong to userId '${userId}'`,
        );

      if (file.uploadState.kind === "uploaded")
        await ctx.storage.delete(file.uploadState.storageId);

      await ctx.db.delete(fileId);
    }

    return null;
  },
});

export const refreshDesktopFileUrl = mutation({
  args: {
    fileId: v.id("files"),
  },
  returns: v.union(
    v.null(),
    v.object({
      url: v.string(),
    }),
  ),

  handler: async (ctx, { fileId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null)
      throw new ConvexError("Authenticated user could not be found");

    const file = await ctx.db.get(fileId);
    if (!file)
      throw new ConvexError(
        `File with id '${fileId}' for userId '${userId}' could not be found`,
      );
    if (file.userId !== userId)
      throw new ConvexError(
        `File '${fileId}' does not belong to userId '${userId}'`,
      );

    if (file.uploadState.kind !== "uploaded") return null;

    const url = await ctx.storage.getUrl(file.uploadState.storageId);
    if (!url)
      throw new ConvexError(
        `Download URL for storageId '${file.uploadState.storageId}' could not be generated`,
      );

    await ctx.db.patch(fileId, {
      uploadState: {
        kind: "uploaded" as const,
        storageId: file.uploadState.storageId,
        url,
      },
    });

    return { url };
  },
});
