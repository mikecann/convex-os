import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { FileItem } from "./FileItem";

type FileGridProps = {
  files: Array<Doc<"files">>;
  selectedFileId: Id<"files"> | null;
  onSelectFile: (fileId: Id<"files">) => void;
  onOpenFile: (fileId: Id<"files">) => void;
};

export function FileGrid({
  files,
  selectedFileId,
  onSelectFile,
  onOpenFile,
}: FileGridProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: "8px",
        overflowY: "auto",
        border: "2px inset #dfdfdf",
        margin: "8px",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "16px",
        }}
      >
        {files.map((file) => (
          <FileItem
            key={file._id}
            file={file}
            isSelected={selectedFileId === file._id}
            onSelect={() => onSelectFile(file._id)}
            onOpen={() => onOpenFile(file._id)}
          />
        ))}
      </div>
    </div>
  );
}
