import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ImagePreviewProcess } from "../processes/imagePreview/ImagePreviewProcess";
import { VideoPlayerProcess } from "../processes/videoPlayer/VideoPlayerProcess";

const processToComponentMap = {
  image_preview: ImagePreviewProcess,
  video_preview: VideoPlayerProcess,
};

export function ProcessSystem() {
  const processes = useQuery(api.my.processes.list);
  return (
    <>
      {processes?.map((process) => {
        const Component = processToComponentMap[process.kind];
        return <Component key={process._id} process={process} />;
      })}
    </>
  );
}
