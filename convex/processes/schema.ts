import { defineTable } from "convex/server";
import { v, Infer } from "convex/values";

export const windowViewStateValidator = v.union(
  v.object({
    kind: v.literal("open"),
    viewStackOrder: v.number(),
  }),
  v.object({
    kind: v.literal("minimized"),
  }),
  v.object({
    kind: v.literal("maximized"),
  }),
);

export const windowValidator = v.object({
  x: v.number(),
  y: v.number(),
  width: v.number(),
  height: v.number(),
  viewState: windowViewStateValidator,
});

const processCommon = {
  userId: v.id("users"),
  name: v.string(),
  window: v.optional(windowValidator),
};

export const processValidator = v.union(
  v.object({
    kind: v.literal("image_preview"),
    props: v.object({
      file: v.id("files"),
    }),
    ...processCommon,
  }),
  v.object({
    kind: v.literal("video_preview"),
    props: v.object({
      file: v.id("files"),
    }),
    ...processCommon,
  }),
  v.object({
    kind: v.literal("sign_in_sign_up"),
    ...processCommon,
  }),
);

export type ProcessKinds = Infer<typeof processValidator>["kind"];

export type Process<TKind extends ProcessKinds = ProcessKinds> = Infer<
  typeof processValidator
> & { kind: TKind };

export const processesTable = defineTable(processValidator).index("by_user", [
  "userId",
]);
