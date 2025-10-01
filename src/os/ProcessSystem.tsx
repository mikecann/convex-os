import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ImagePreviewProcess } from "../processes/imagePreview/ImagePreviewProcess";
import { Process } from "../../convex/processes/schema";
import { VideoPlayerProcess } from "../processes/videoPlayer/VideoPlayerProcess";
import { ProcessKinds } from "../../convex/processes/schema";

const processToComponentMap: {
  [K in ProcessKinds]: React.ComponentType<{ process: Process<K> }>;
} = {
  image_preview: ImagePreviewProcess,
  video_player: VideoPlayerProcess,
};

export function ProcessSystem() {
  const processes = useQuery(api.my.processes.list);
  return (
    <>
      {processes?.map((process) => {
        const Component: any = processToComponentMap[process.kind];
        return <Component key={process._id} process={process} />;
      })}
    </>
  );
}
