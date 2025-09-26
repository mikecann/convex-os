import { ConvexError } from "convex/values";
import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import { DatabaseReader, DatabaseWriter } from "../_generated/server";

export const files = {
  find: (db: DatabaseReader, { fileId }: { fileId: Id<"files"> }) =>
    db.get(fileId),

  get: (db: DatabaseReader, { fileId }: { fileId: Id<"files"> }) =>
    files.find(db, { fileId }).then(ensureFP(`could not find file ${fileId}`)),

  getForUser: async (
    db: DatabaseReader,
    { userId, fileId }: { userId: Id<"users">; fileId: Id<"files"> },
  ) => {
    const file = await files.get(db, { fileId });
    if (file.userId !== userId)
      throw new ConvexError(`file ${fileId} does not belong to user ${userId}`);
    return file;
  },

  ensureUserOwnsFile: async (
    db: DatabaseReader,
    { userId, fileId }: { userId: Id<"users">; fileId: Id<"files"> },
  ) => {
    await files.getForUser(db, { userId, fileId });
  },

  listForUser: (db: DatabaseReader, { userId }: { userId: Id<"users"> }) =>
    db
      .query("files")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect(),

  create: (
    db: DatabaseWriter,
    args: {
      name: string;
      size: number;
      type: string;
      position: { x: number; y: number };
      userId: Id<"users">;
    },
  ) => {
    return db.insert("files", {
      name: args.name,
      size: args.size,
      type: args.type,
      position: args.position,
      userId: args.userId,
      uploadState: { kind: "created" },
    });
  },
};
