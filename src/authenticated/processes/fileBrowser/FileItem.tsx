import { Doc } from "../../../../convex/_generated/dataModel";
import { DesktopFileImage } from "../../files/DesktopFileImage";

type FileItemProps = {
  file: Doc<"files">;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
};

export function FileItem({
  file,
  isSelected,
  onSelect,
  onOpen,
}: FileItemProps) {
  return (
    <div
      onClick={onSelect}
      onDoubleClick={onOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px",
        cursor: "pointer",
        backgroundColor: isSelected ? "#316AC5" : "transparent",
        color: isSelected ? "#fff" : "#000",
        borderRadius: "2px",
      }}
    >
      <DesktopFileImage file={file} size={32} />
      <div
        style={{
          fontSize: "11px",
          textAlign: "center",
          wordBreak: "break-word",
          marginTop: "4px",
        }}
      >
        {file.name}
      </div>
    </div>
  );
}
