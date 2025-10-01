import { v, Infer } from "convex/values";
import { defineTable } from "convex/server";

export const windowViewStateValidator = v.union(
  v.object({
    kind: v.literal("open"),
    viewStackOrder: v.number(),
    isActive: v.boolean(),
  }),
  v.object({
    kind: v.literal("minimized"),
  }),
  v.object({
    kind: v.literal("maximized"),
  }),
);

export const windowValidator = v.object({
  processId: v.id("processes"),
  x: v.number(),
  y: v.number(),
  width: v.number(),
  height: v.number(),
  title: v.string(),
  viewState: windowViewStateValidator,
});

export type Window = Infer<typeof windowValidator>;

export type WindowViewState = Infer<typeof windowViewStateValidator>;

export type WindowCreationParams = Omit<
  Infer<typeof windowValidator>,
  "processId"
>;

export const windowsTable = defineTable(windowValidator).index("by_processId", [
  "processId",
]);
