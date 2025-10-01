import { useQuery } from "convex/react";
import { Process } from "../../../convex/processes/schema";
import { api } from "../../../convex/_generated/api";
import { ImagePreviewWindow } from "./ImagePreviewWindow";

export const ImagePreviewProcess = ({
  process,
}: {
  process: Process<"image_preview">;
}) => {
  const windows = useQuery(api.my.windows.listForProcess, {
    processId: process._id,
  });
  return (
    <>
      {windows?.map((window) => (
        <ImagePreviewWindow
          key={window._id}
          process={process}
          window={window}
        />
      ))}
    </>
  );
};
