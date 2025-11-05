import { ConvexError } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import {
  DatabaseReader,
  DatabaseWriter,
  MutationCtx,
} from "../_generated/server";
import { clamp } from "../../shared/num";


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
        if (file.uploadState.kind !== "uploaded") throw new Error("File is not uploaded");
        return file;
      },
    };
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

          async startUpload({ db, storage }: MutationCtx) {
            const file = await this.get(db);

            if (file.uploadState.kind !== "created")
              throw new ConvexError(`File ${fileId} is not in a created state`);

            const uploadUrl = await storage.generateUploadUrl();

            await db.patch(fileId, {
              uploadState: {
                kind: "uploading",
                progress: 0,
                uploadUrl,
              },
            });

            return { uploadUrl };
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

          async completeUpload(
            { db, storage }: MutationCtx,
            { storageId }: { storageId: Id<"_storage"> },
          ) {
            const file = await this.get(db);

            if (file.uploadState.kind !== "uploading")
              throw new ConvexError(
                `File ${fileId} is not in a uploading state`,
              );

            const url = await storage.getUrl(storageId);
            if (!url)
              throw new ConvexError(
                `Download URL for storageId '${storageId}' could not be generated`,
              );

            await db.patch(fileId, {
              uploadState: {
                kind: "uploaded",
                storageId,
                url,
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
        { db, storage }: MutationCtx,
        { fileIds }: { fileIds: Array<Id<"files">> },
      ) {
        for (const fileId of fileIds) {
          const file = await this.forFile(fileId).get(db);

          if (file.uploadState.kind === "uploaded")
            await storage.delete(file.uploadState.storageId);

          await db.delete(fileId);
        }
      },
    };
  },
};
