import { Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "../../../common/components/Button";

export type FileTypeFilter =
  | "all"
  | "png"
  | "jpeg"
  | "gif"
  | "webp"
  | "mp4"
  | "webm"
  | "txt"
  | "md"
  | "json";

type FileBrowserControlsProps = {
  selectedFile: Doc<"files"> | undefined;
  fileTypeFilter: FileTypeFilter;
  mainFileType: "image" | "video" | "text";
  onFileTypeFilterChange: (filter: FileTypeFilter) => void;
  onOpen: () => void;
  onCancel: () => void;
  isOpenDisabled: boolean;
};

export function FileBrowserControls({
  selectedFile,
  fileTypeFilter,
  mainFileType,
  onFileTypeFilterChange,
  onOpen,
  onCancel,
  isOpenDisabled,
}: FileBrowserControlsProps) {
  return (
    <div
      style={{
        padding: "8px",
        borderTop: "1px solid #dfdfdf",
        backgroundColor: "#ECE9D8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <label
          style={{
            marginRight: "8px",
            fontSize: "11px",
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          File name:
        </label>
        <input
          type="text"
          value={selectedFile?.name ?? ""}
          readOnly
          style={{
            flex: 1,
            padding: "2px 4px",
            fontSize: "11px",
            fontFamily: "Tahoma, sans-serif",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              marginRight: "8px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            Files of type:
          </label>
          <select
            value={fileTypeFilter}
            onChange={(e) =>
              onFileTypeFilterChange(e.target.value as FileTypeFilter)
            }
            style={{
              padding: "2px 4px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            {mainFileType === "image" && (
              <>
                <option value="all">All Images</option>
                <option value="png">PNG Files (*.png)</option>
                <option value="jpeg">JPEG Files (*.jpg, *.jpeg)</option>
                <option value="gif">GIF Files (*.gif)</option>
                <option value="webp">WebP Files (*.webp)</option>
              </>
            )}
            {mainFileType === "video" && (
              <>
                <option value="all">All Videos</option>
                <option value="mp4">MP4 Files (*.mp4)</option>
                <option value="webm">WebM Files (*.webm)</option>
              </>
            )}
            {mainFileType === "text" && (
              <>
                <option value="all">All Text Files</option>
                <option value="txt">Text Files (*.txt)</option>
                <option value="md">Markdown Files (*.md)</option>
                <option value="json">JSON Files (*.json)</option>
              </>
            )}
          </select>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            onClick={onOpen}
            disabled={isOpenDisabled}
            style={{
              padding: "4px 16px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            Open
          </Button>
          <Button
            onClick={onCancel}
            style={{
              padding: "4px 16px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
