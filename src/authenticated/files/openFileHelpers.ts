import { FunctionArgs } from "convex/server";
import { Id } from "../../../convex/_generated/dataModel";
import {
  isImageFile,
  isVideoFile,
  isTextFile,
} from "../../../shared/fileTypes";
import { api } from "../../../convex/_generated/api";
import {
  startImagePreview,
  startVideoPlayer,
  startTextPreview,
} from "../processes/startProcessHelpers";

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
  if (isImageFile(file)) 
    return startImagePreview({
      x: file.position.x,
      y: file.position.y,
      fileId: file._id,
      fileName: file.name,
    });
  

  if (isVideoFile(file)) 
    return startVideoPlayer({
      x: file.position.x,
      y: file.position.y,
      fileId: file._id,
      fileName: file.name,
    });
  

  if (isTextFile(file)) 
    return startTextPreview({
      x: file.position.x,
      y: file.position.y,
      fileId: file._id,
      fileName: file.name,
    });
  

  return null;
}
