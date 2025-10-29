import { Doc } from "../../../../convex/_generated/dataModel";

export type FileTypeFilter = "all" | "png" | "jpeg" | "gif" | "webp";

type FileBrowserControlsProps = {
  selectedFile: Doc<"files"> | undefined;
  fileTypeFilter: FileTypeFilter;
  onFileTypeFilterChange: (filter: FileTypeFilter) => void;
  onOpen: () => void;
  onCancel: () => void;
  isOpenDisabled: boolean;
};

export function FileBrowserControls({
  selectedFile,
  fileTypeFilter,
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
            <option value="all">All Images</option>
            <option value="png">PNG Files (*.png)</option>
            <option value="jpeg">JPEG Files (*.jpg, *.jpeg)</option>
            <option value="gif">GIF Files (*.gif)</option>
            <option value="webp">WebP Files (*.webp)</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onOpen}
            disabled={isOpenDisabled}
            style={{
              padding: "4px 16px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            Open
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "4px 16px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
