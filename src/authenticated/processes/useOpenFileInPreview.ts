import { useCallback } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import {
  isImageFile,
  isVideoFile,
  isTextFile,
} from "../../../shared/fileTypes";
import { exhaustiveCheck } from "../../../shared/misc";
import {
  startImagePreview,
  startVideoPlayer,
  startTextPreview,
} from "./startProcessHelpers";
import { useStartCenteredApp } from "./useStartCenteredApp";

type FileToOpen = {
  _id: Id<"files">;
  name: string;
  type?: string;
};

type FileTypeKind =
  | { kind: "image" }
  | { kind: "video" }
  | { kind: "text" }
  | { kind: "unsupported" };

function getFileTypeKind(file: FileToOpen): FileTypeKind {
  if (isImageFile(file)) return { kind: "image" };
  if (isVideoFile(file)) return { kind: "video" };
  if (isTextFile(file)) return { kind: "text" };
  return { kind: "unsupported" };
}

export function useOpenFileInPreview() {
  const startCenteredApp = useStartCenteredApp();

  return useCallback(
    (
      file: FileToOpen,
      options?: { x?: number; y?: number },
    ): void => {
      const fileType = getFileTypeKind(file);

      if (fileType.kind === "image") {
        void startCenteredApp(
          startImagePreview({
            fileId: file._id,
            fileName: file.name,
            x: options?.x,
            y: options?.y,
          }),
        );
        return;
      }
      if (fileType.kind === "video") {
        void startCenteredApp(
          startVideoPlayer({
            fileId: file._id,
            fileName: file.name,
            x: options?.x,
            y: options?.y,
          }),
        );
        return;
      }
      if (fileType.kind === "text") {
        void startCenteredApp(
          startTextPreview({
            fileId: file._id,
            fileName: file.name,
            x: options?.x,
            y: options?.y,
          }),
        );
        return;
      }
      if (fileType.kind === "unsupported") return;
      exhaustiveCheck(fileType);
    },
    [startCenteredApp],
  );
}

