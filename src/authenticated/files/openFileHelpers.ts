import { FunctionArgs } from "convex/server";
import { Id } from "../../../convex/_generated/dataModel";
import {
  isImageFile,
  isVideoFile,
  isTextFile,
} from "../../../shared/fileTypes";
import { api } from "../../../convex/_generated/api";

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
    return {
      kind: "image_preview",
      props: { fileId: file._id },
      windowCreationParams: {
        x: file.position.x,
        y: file.position.y,
        width: 480,
        height: 320,
        title: file.name,
        icon: "/xp/image.png",
      },
    };
  }

  if (isVideoFile(file)) {
    return {
      kind: "video_player",
      props: { fileId: file._id },
      windowCreationParams: {
        x: file.position.x,
        y: file.position.y,
        width: 480,
        height: 320,
        title: file.name,
        icon: "/xp/mediaplayer.png",
      },
    };
  }

  if (isTextFile(file)) {
    return {
      kind: "text_preview",
      props: { fileId: file._id },
      windowCreationParams: {
        x: file.position.x,
        y: file.position.y,
        width: 600,
        height: 400,
        title: file.name,
        icon: "/xp/doc.png",
      },
    };
  }

  return null;
}
