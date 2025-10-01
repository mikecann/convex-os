import { v } from "convex/values";
import { processDefinitions } from "../processes/schema";

const windowCreationParams = {
  x: v.number(),
  y: v.number(),
  width: v.number(),
  height: v.number(),
  title: v.string(),
};

export const appStartingValidator = v.union(
  v.object({
    ...processDefinitions.image_preview,
    windowCreationParams: v.object(windowCreationParams),
  }),
  v.object({
    ...processDefinitions.video_player,
    windowCreationParams: v.object(windowCreationParams),
  }),
);
