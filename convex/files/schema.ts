import { defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const fileUploadStateValidator = v.union(
  v.object({
    kind: v.literal("created"),
  }),
  v.object({
    kind: v.literal("uploading"),
    progress: v.number(),
    uploadUrl: v.string(),
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
);

export type FileUploadStateKinds = Infer<
  typeof fileUploadStateValidator
>["kind"];

export type FileUploadState<
  TKind extends FileUploadStateKinds = FileUploadStateKinds,
> = Infer<typeof fileUploadStateValidator> & { kind: TKind };

export const filesTable = defineTable({
  userId: v.id("users"),
  name: v.string(),
  size: v.number(),
  type: v.string(),
  position: v.object({
    x: v.number(),
    y: v.number(),
  }),
  uploadState: fileUploadStateValidator,
}).index("by_user", ["userId"]);
