import {
  CSSProperties,
  RefObject,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useErrorHandler } from "../../common/errors/useErrorHandler";
import { DesktopFileImage } from "./DesktopFileImage";

export type DesktopFileDoc = Doc<"files">;

type DesktopFileIconProps = {
  file: DesktopFileDoc;
  onOpen?: (file: DesktopFileDoc) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  registerNode: (element: HTMLDivElement | null) => void;
  isSelected: boolean;
  onMouseDown: (event: ReactMouseEvent<HTMLDivElement>) => void;
};

export function DesktopFileIcon({
  file,
  onOpen,
  containerRef,
  registerNode,
  isSelected,
  onMouseDown,
}: DesktopFileIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const updatePosition = useMutation(api.my.files.updatePosition);
  const renameFile = useMutation(api.my.files.rename);
  const onError = useErrorHandler();
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(file.name);
  const renamedDuringSessionRef = useRef(false);

  useEffect(() => {
    if (!isRenaming) return;
    if (!inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.select();
  }, [isRenaming]);

  useEffect(() => {
    if (isRenaming) return;
    setNameDraft(file.name);
    renamedDuringSessionRef.current = false;
  }, [file.name, isRenaming]);

  const handleRenameSubmit = async () => {
    const trimmedName = nameDraft.trim();

    if (trimmedName.length === 0) {
      setNameDraft(file.name);
      setIsRenaming(false);
      return;
    }

    if (trimmedName === file.name) {
      setIsRenaming(false);
      return;
    }

    await renameFile({ fileId: file._id, name: trimmedName })
      .catch(onError)
      .finally(() => setIsRenaming(false));
  };

  return (
    <div
      ref={registerNode}
      draggable={!isRenaming}
      onMouseDown={(event) => {
        event.stopPropagation();
        if (event.button !== 0) return;
        event.currentTarget.focus();
        if (isRenaming) return;
        onMouseDown(event);
      }}
      onDragStart={(event) => {
        if (isRenaming) {
          event.preventDefault();
          return;
        }
        setIsDragging(true);
        const rect = containerRef.current?.getBoundingClientRect();
        const containerLeft = rect?.left ?? 0;
        const containerTop = rect?.top ?? 0;
        dragOffsetRef.current = {
          x: event.clientX - (containerLeft + file.position.x),
          y: event.clientY - (containerTop + file.position.y),
        };
        event.dataTransfer.effectAllowed = "copyMove";
        event.dataTransfer.setData("application/x-desktop-file-id", file._id);
      }}
      onDragEnd={async (event) => {
        setIsDragging(false);
        if (isRenaming) return;

        if (event.dataTransfer.dropEffect === "copy") return;

        const rect = containerRef.current?.getBoundingClientRect();
        const containerLeft = rect?.left ?? 0;
        const containerTop = rect?.top ?? 0;
        const newX = event.clientX - containerLeft - dragOffsetRef.current.x;
        const newY = event.clientY - containerTop - dragOffsetRef.current.y;

        if (Number.isNaN(newX) || Number.isNaN(newY)) return;

        try {
          await updatePosition({
            fileId: file._id,
            position: { x: newX, y: newY },
          });
        } catch (error) {
          onError(error);
        }
      }}
      onDoubleClick={() => {
        if (onOpen) onOpen(file);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isRenaming) {
          event.preventDefault();
          setNameDraft(file.name);
          setIsRenaming(false);
          return;
        }
        if (event.key !== "F2") return;
        if (!isSelected) return;
        if (isRenaming) return;
        if (renamedDuringSessionRef.current) return;
        event.preventDefault();
        setNameDraft(file.name);
        setIsRenaming(true);
        renamedDuringSessionRef.current = true;
      }}
      tabIndex={0}
      style={{
        position: "absolute",
        left: `${file.position.x}px`,
        top: `${file.position.y}px`,
        width: "96px",
        minHeight: "112px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        cursor: isRenaming ? "text" : isDragging ? "grabbing" : "pointer",
        userSelect: "none",
        textAlign: "center",
        color: "white",
        textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
        borderRadius: "8px",
        padding: "6px",
        boxSizing: "border-box",
        border: isSelected
          ? "1px solid rgba(255,255,255,0.8)"
          : "1px solid transparent",
        backgroundColor: isSelected
          ? "rgba(59,130,246,0.35)"
          : "rgba(0,0,0,0.0)",
      }}
    >
      <DesktopFileImage file={file} />
      {isRenaming ? (
        <input
          ref={inputRef}
          value={nameDraft}
          onChange={(event) => {
            setNameDraft(event.target.value);
          }}
          onBlur={() => {
            void handleRenameSubmit();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleRenameSubmit();
              return;
            }
            if (event.key !== "Escape") return;
            event.preventDefault();
            setNameDraft(file.name);
            setIsRenaming(false);
          }}
          style={{
            fontSize: "12px",
            lineHeight: "1.2",
            maxWidth: "84px",
            width: "100%",
            padding: "2px",
            borderRadius: "4px",
            border: "1px solid rgba(255,255,255,0.8)",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            textAlign: "center",
            outline: "none",
          }}
          spellCheck={false}
        />
      ) : (
        <span
          style={{
            fontSize: "12px",
            lineHeight: "1.2",
            maxWidth: "84px",
            padding: "0 2px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {file.name}
        </span>
      )}

      {file.uploadState.kind === "uploading" ? (
        <span style={{ fontSize: "10px" }}>{file.uploadState.progress}%</span>
      ) : null}

      {file.uploadState.kind === "errored" ? (
        <span style={{ fontSize: "10px", color: "#ffb4b4" }}>
          {file.uploadState.message}
        </span>
      ) : null}
    </div>
  );
}
