import { defineTable } from "convex/server";
import { v } from "convex/values";

export const cheffyMessageMetadataTable = defineTable({
  messageId: v.string(),
  userId: v.id("users"),
  fileIds: v.array(v.id("files")),
}).index("by_messageId", ["messageId"]);

