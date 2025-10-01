import { useQuery } from "convex/react";
import { TextPreviewWindow } from "./TextPreviewWindow";
import { Process } from "../../../../convex/processes/schema";
import { api } from "../../../../convex/_generated/api";

export const TextPreviewProcess = ({
  process,
}: {
  process: Process<"text_preview">;
}) => {
  const windows = useQuery(api.my.windows.listForProcess, {
    processId: process._id,
  });
  return (
    <>
      {windows?.map((window) => (
        <TextPreviewWindow key={window._id} process={process} window={window} />
      ))}
    </>
  );
};
