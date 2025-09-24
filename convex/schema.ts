import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  files: defineTable({
    userId: v.id("users"),
    name: v.string(),
    size: v.number(),
    type: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    uploadState: v.union(
      v.object({
        kind: v.literal("created"),
      }),
      v.object({
        kind: v.literal("uploading"),
        progress: v.number(),
      }),
      v.object({
        kind: v.literal("uploaded"),
        storageId: v.id("_storage"),
        url: v.string(),
      }),
      v.object({
        kind: v.literal("errored"),
        message: v.string(),
      }),
    ),
  }).index("by_user", ["userId"]),
});
