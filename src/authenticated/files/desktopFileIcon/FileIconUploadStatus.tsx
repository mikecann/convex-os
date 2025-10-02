import { DesktopFileDoc } from "./DesktopFileIcon";

interface FileIconUploadStatusProps {
  uploadState: DesktopFileDoc["uploadState"];
}

export function FileIconUploadStatus({
  uploadState,
}: FileIconUploadStatusProps) {
  if (uploadState.kind === "uploading") {
    return <span style={{ fontSize: "10px" }}>{uploadState.progress}%</span>;
  }

  if (uploadState.kind === "errored") {
    return (
      <span style={{ fontSize: "10px", color: "#ffb4b4" }}>
        {uploadState.message}
      </span>
    );
  }

  return null;
}
