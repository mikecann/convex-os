import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Process } from "../../convex/processes/schema";
import { ProcessKinds } from "../../convex/processes/schema";
import { ImagePreviewProcess } from "../authenticated/processes/imagePreview/ImagePreviewProcess";
import { VideoPlayerProcess } from "../authenticated/processes/videoPlayer/VideoPlayerProcess";

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
