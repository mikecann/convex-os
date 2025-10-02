import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Process } from "../../../convex/processes/schema";
import { ProcessKinds } from "../../../convex/processes/schema";
import { ImagePreviewWindow } from "./imagePreview/ImagePreviewWindow";
import { VideoPlayerWindow } from "./videoPlayer/VideoPlayerWindow";
import { TextPreviewWindow } from "./textPreview/TextPreviewWindow";
import { CheffyChatWindow } from "./cheffyChat/CheffyChatWindow";
import { Doc } from "../../../convex/_generated/dataModel";

const processToComponentMap: {
  [K in ProcessKinds]: React.ComponentType<{
    process: Process<K>;
    window: Doc<"windows">;
  }>;
} = {
  image_preview: ImagePreviewWindow,
  video_player: VideoPlayerWindow,
  text_preview: TextPreviewWindow,
  cheffy_chat: CheffyChatWindow,
};

export function ProcessSystem() {
  const processes = useQuery(api.my.processes.list);
  return (
    <>
      {processes?.map((process) => (
        <ProcessRenderer key={process._id} process={process} />
      ))}
    </>
  );
}

function ProcessRenderer({ process }: { process: Process }) {
  const windows = useQuery(api.my.windows.listForProcess, {
    processId: process._id,
  });
  return (
    <>
      {windows?.map((window) => {
        const Component = processToComponentMap[process.kind] as any;
        return <Component key={window._id} process={process} window={window} />;
      })}
    </>
  );
}
