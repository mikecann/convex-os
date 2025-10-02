import { FunctionArgs } from "convex/server";
import { Id } from "../../../convex/_generated/dataModel";
import {
  isImageFile,
  isVideoFile,
  isTextFile,
} from "../../../shared/fileTypes";
import { api } from "../../../convex/_generated/api";
import { createProcessStartParams } from "../processes/startProcessHelpers";

type FileWithNameTypeAndPosition = {
  _id: Id<"files">;
  name: string;
  type?: string;
  position: { x: number; y: number };
};

type AppStartParams = FunctionArgs<typeof api.my.processes.start>["process"];

export function getProcessStartingParams(
  file: FileWithNameTypeAndPosition,
): AppStartParams | null {
  if (isImageFile(file)) {
    return createProcessStartParams("image_preview", {
      x: file.position.x,
      y: file.position.y,
      fileId: file._id,
      fileName: file.name,
    });
  }

  if (isVideoFile(file)) {
    return createProcessStartParams("video_player", {
      x: file.position.x,
      y: file.position.y,
      fileId: file._id,
      fileName: file.name,
    });
  }

  if (isTextFile(file)) {
    return createProcessStartParams("text_preview", {
      x: file.position.x,
      y: file.position.y,
      fileId: file._id,
      fileName: file.name,
    });
  }

  return null;
}
