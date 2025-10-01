import { VideoPlayerWindow } from "./VideoPlayerWindow";
import { useQuery } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { api } from "../../../../convex/_generated/api";

export const VideoPlayerProcess = ({
  process,
}: {
  process: Process<"video_player">;
}) => {
  const windows = useQuery(api.my.windows.listForProcess, {
    processId: process._id,
  });
  return (
    <>
      {windows?.map((window) => (
        <VideoPlayerWindow key={window._id} process={process} window={window} />
      ))}
    </>
  );
};
