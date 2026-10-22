import { ConvexError } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import {
  DatabaseReader,
  DatabaseWriter,
  MutationCtx,
} from "../_generated/server";
import { clamp } from "../../shared/num";

// HTTP actions accept request bodies up to 20MB.
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const UPLOAD_TOKEN_TTL = 60 * 60 * 1000;

export const files = {
  forFile(fileId: Id<"files">) {
    return {
      find(db: DatabaseReader) {
        return db.get(fileId);
      },

      get(db: DatabaseReader) {
        return this.find(db).then(ensureFP(`could not find file ${fileId}`));
      },

      async getUploaded(db: DatabaseReader) {
        const file = await this.get(db);
        if (file.uploadState.kind !== "uploaded")
          throw new Error("File is not uploaded");
        return file;
      },
    };
  },

  forUpload(fileId: Id<"files">, token: string) {
    return {
      async find(db: DatabaseReader) {
        const file = await db.get(fileId);
        if (
          !file ||
          file.uploadState.kind !== "uploading" ||
          !file.uploadState.uploadToken ||
          file.uploadState.uploadToken !== token ||
          Date.now() - (file.uploadState.startedAt ?? 0) > UPLOAD_TOKEN_TTL
        )
          return null;
        return file;
      },

      // Only for a blob the upload HTTP action has just stored. False means
      // the caller must delete that blob.
      async complete(
        { db, storage }: MutationCtx,
        { storageId }: { storageId: Id<"_storage"> },
      ) {
        if (!(await this.find(db))) return false;
        const stored = await db.system.get(storageId);
        if (!stored || stored.size > MAX_UPLOAD_BYTES) return false;
        const url = await storage.getUrl(storageId);
        if (!url) return false;
        await db.patch(fileId, {
          size: stored.size,
          uploadState: { kind: "uploaded", storageId, url },
        });
        return true;
      },
    };
  },

  // Older clients could link any storage ID they knew, so a blob may also be
  // referenced by someone else's file. Only delete it when nothing else does.
  async deleteUnsharedStorage(
    { db, storage }: MutationCtx,
    storageId: Id<"_storage">,
    deletingFileId: Id<"files">,
  ) {
    const others = (
      await db
        .query("files")
        .withIndex("by_storage", (q) =>
          q.eq("uploadState.storageId", storageId),
        )
        .take(2)
    ).filter((other) => other._id !== deletingFileId);
    if (others.length === 0) await storage.delete(storageId);
  },

  forUser(userId: Id<"users">) {
    return {
      list: async (db: DatabaseReader) => {
        return db
          .query("files")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();
      },

      create: (
        db: DatabaseWriter,
        args: {
          name: string;
          size: number;
          type: string;
          position: { x: number; y: number };
        },
      ) => {
        return db.insert("files", {
          name: args.name,
          size: args.size,
          type: args.type,
          position: args.position,
          userId: userId,
          uploadState: { kind: "created" },
        });
      },

      createAll: (
        db: DatabaseWriter,
        args: {
          files: Array<{
            name: string;
            size: number;
            type: string;
            position: { x: number; y: number };
          }>;
        },
      ) => {
        return Promise.all(
          args.files.map((f) =>
            db.insert("files", {
              name: f.name,
              size: f.size,
              type: f.type,
              position: f.position,
              userId: userId,
              uploadState: { kind: "created" },
            }),
          ),
        );
      },

      forFile(fileId: Id<"files">) {
        return {
          async find(db: DatabaseReader) {
            const file = await db.get(fileId);
            if (!file) return null;
            if (file.userId !== userId)
              throw new ConvexError(
                `file ${fileId} does not belong to user ${userId}`,
              );
            return file;
          },

          get(db: DatabaseReader) {
            return this.find(db).then(
              ensureFP(`could not find file ${fileId}`),
            );
          },

          async ensureOwnership(db: DatabaseReader) {
            const file = await this.find(db);
            if (!file)
              throw new ConvexError(
                `file ${fileId} does not exist or belongs to a different user`,
              );
          },

          // Uploads go through our own HTTP action (convex/http.ts), which
          // stores the bytes and links the new blob itself. Clients never
          // name a storage ID, so knowing one can't adopt someone's blob.
          async startUpload({ db }: MutationCtx) {
            const file = await this.get(db);

            if (file.uploadState.kind !== "created")
              throw new ConvexError(`File ${fileId} is not in a created state`);

            const siteUrl = process.env.CONVEX_SITE_URL;
            if (!siteUrl) throw new Error("CONVEX_SITE_URL is not available");
            const uploadToken = crypto.randomUUID() + crypto.randomUUID();
            const url = new URL("/files/upload", siteUrl);
            url.searchParams.set("fileId", fileId);
            url.searchParams.set("token", uploadToken);
            const uploadUrl = url.toString();

            await db.patch(fileId, {
              uploadState: {
                kind: "uploading",
                progress: 0,
                uploadUrl,
                uploadToken,
                startedAt: Date.now(),
              },
            });

            return { uploadUrl };
          },

          // For frontends cached from before server-side linking, which
          // still call my/files:completeUpload after uploading. Writes
          // nothing: it only confirms the upload action already linked this
          // exact blob to this file.
          async confirmUploaded(
            db: DatabaseReader,
            { storageId }: { storageId: Id<"_storage"> },
          ) {
            const file = await this.get(db);
            if (
              file.uploadState.kind !== "uploaded" ||
              file.uploadState.storageId !== storageId
            )
              throw new ConvexError(
                "This upload can't be completed. Refresh the page and upload the file again.",
              );
          },

          async updateUploadProgress(
            db: DatabaseWriter,
            { progress }: { progress: number },
          ) {
            const file = await this.get(db);

            if (file.uploadState.kind !== "uploading")
              throw new ConvexError(
                `File ${fileId} is not in a uploading state`,
              );

            await db.patch(fileId, {
              uploadState: {
                ...file.uploadState,
                progress: clamp(progress, 0, 100),
              },
            });
          },

          async setUploadError(
            db: DatabaseWriter,
            { message }: { message: string },
          ) {
            const file = await this.get(db);

            if (file.uploadState.kind !== "uploading")
              throw new ConvexError(
                `File ${fileId} is not in a uploading state`,
              );

            await db.patch(fileId, {
              uploadState: {
                kind: "errored",
                message,
              },
            });
          },

          async updatePosition(
            db: DatabaseWriter,
            { position }: { position: { x: number; y: number } },
          ) {
            await this.ensureOwnership(db);
            await db.patch(fileId, { position });
          },

          async rename(db: DatabaseWriter, { name }: { name: string }) {
            const trimmedName = name.trim();
            if (trimmedName.length === 0)
              throw new ConvexError(
                `File name for '${fileId}' could not be updated because the provided name is empty`,
              );

            await this.ensureOwnership(db);
            await db.patch(fileId, { name: trimmedName });
          },
        };
      },

      async updatePositions(
        db: DatabaseWriter,
        {
          updates,
        }: {
          updates: Array<{
            fileId: Id<"files">;
            position: { x: number; y: number };
          }>;
        },
      ) {
        for (const { fileId, position } of updates) {
          await this.forFile(fileId).ensureOwnership(db);
          await db.patch(fileId, { position });
        }
      },

      async deleteAll(
        ctx: MutationCtx,
        { fileIds }: { fileIds: Array<Id<"files">> },
      ) {
        for (const fileId of fileIds) {
          const file = await this.forFile(fileId).get(ctx.db);

          if (file.uploadState.kind === "uploaded")
            await files.deleteUnsharedStorage(
              ctx,
              file.uploadState.storageId,
              fileId,
            );

          await ctx.db.delete(fileId);
        }
      },
    };
  },
};
