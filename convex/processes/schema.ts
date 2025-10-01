import { defineTable } from "convex/server";
import { v, Infer } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { produceLiteral } from "../../shared/misc";

const processCommon = {
  userId: v.id("users"),
};

const processKinds = produceLiteral([
  "image_preview",
  "video_player",
  "text_preview",
]);

export const processDefinitions = {
  image_preview: {
    kind: v.literal(processKinds.image_preview),
    props: v.object({
      fileId: v.id("files"),
    }),
  },
  video_player: {
    kind: v.literal(processKinds.video_player),
    props: v.object({
      fileId: v.id("files"),
    }),
  },
  text_preview: {
    kind: v.literal(processKinds.text_preview),
    props: v.object({
      fileId: v.id("files"),
    }),
  },
} satisfies Record<keyof typeof processKinds, any>;

export const processValidator = v.union(
  v.object({
    ...processDefinitions.image_preview,
    ...processCommon,
  }),
  v.object({
    ...processDefinitions.video_player,
    ...processCommon,
  }),
  v.object({
    ...processDefinitions.text_preview,
    ...processCommon,
  }),
);

export const processCreationValidator = v.union(
  v.object({
    ...processDefinitions.image_preview,
  }),
  v.object({
    ...processDefinitions.video_player,
  }),
  v.object({
    ...processDefinitions.text_preview,
  }),
);

const windowCreationParams = {
  x: v.number(),
  y: v.number(),
  width: v.number(),
  height: v.number(),
  title: v.string(),
};

export const processStartingValidator = v.union(
  v.object({
    ...processDefinitions.image_preview,
    windowCreationParams: v.object(windowCreationParams),
  }),
  v.object({
    ...processDefinitions.video_player,
    windowCreationParams: v.object(windowCreationParams),
  }),
  v.object({
    ...processDefinitions.text_preview,
    windowCreationParams: v.object(windowCreationParams),
  }),
);


export const processPropsUpdateValidator = v.union(
  processDefinitions.image_preview.props,
  processDefinitions.video_player.props,
  processDefinitions.text_preview.props,
);

export type ProcessKinds = Infer<typeof processValidator>["kind"];

export type Process<TKind extends ProcessKinds = ProcessKinds> =
  Doc<"processes"> & { kind: TKind };

export type ProcessWithWindow<TKind extends ProcessKinds = ProcessKinds> =
  Process<TKind> & { window: Window };

export const processesTable = defineTable(processValidator).index("by_user", [
  "userId",
]);
