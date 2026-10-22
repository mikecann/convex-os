import { defineTable } from "convex/server";
import { v } from "convex/values";

export const cheffyMessageMetadataTable = defineTable({
  messageId: v.string(),
  userId: v.id("users"),
  fileIds: v.array(v.id("files")),
}).index("by_messageId", ["messageId"]);

// Daily paid-call counters. scope is "global" or "user:<userId>", day is a
// UTC "YYYY-MM-DD" key.
export const cheffyUsageTable = defineTable({
  scope: v.string(),
  day: v.string(),
  count: v.number(),
}).index("by_scope_day", ["scope", "day"]);
