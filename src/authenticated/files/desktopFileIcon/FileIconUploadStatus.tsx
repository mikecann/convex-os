import { ProgressBar } from "../../../common/components/ProgressBar";
import { DesktopFileDoc } from "./DesktopFileIcon";

interface FileIconUploadStatusProps {
  uploadState: DesktopFileDoc["uploadState"];
}

export function FileIconUploadStatus({
  uploadState,
}: FileIconUploadStatusProps) {
  if (uploadState.kind === "uploading")
    return (
      <ProgressBar
        max={100}
        value={uploadState.progress}
        style={{ width: "100%", height: "12px" }}
      />
    );

  if (uploadState.kind === "errored")
    return (
      <span style={{ fontSize: "10px", color: "#ffb4b4" }}>
        {uploadState.message}
      </span>
    );

  return null;
}
