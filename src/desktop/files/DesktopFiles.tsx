import { DesktopFileIcon } from "./DesktopFileIcon";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  useDesktopFileUploader,
  DesktopFileUpload,
} from "./useDesktopFileUploader";
import { useErrorHandler } from "../../common/errors/useErrorHandler";
import { Id } from "../../../convex/_generated/dataModel";

export function DesktopFiles() {
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const files = useQuery(api.files.listDesktopFiles) ?? [];
  const deleteFiles = useMutation(api.files.deleteDesktopFiles);
  const { uploadFiles } = useDesktopFileUploader();
  const handleError = useErrorHandler();

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragOver(false);
    };

    window.addEventListener("dragend", handleGlobalDragEnd);
    window.addEventListener("drop", handleGlobalDragEnd);

    return () => {
      window.removeEventListener("dragend", handleGlobalDragEnd);
      window.removeEventListener("drop", handleGlobalDragEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onDrop={async (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsDragOver(false);

        if (event.dataTransfer.files.length === 0) return;

        const deskRect = containerRef.current?.getBoundingClientRect();
        const dropX = event.clientX - (deskRect?.left ?? 0);
        const dropY = event.clientY - (deskRect?.top ?? 0);

        const uploads: Array<DesktopFileUpload> = Array.from(
          event.dataTransfer.files,
        ).map((file, index) => ({
          file,
          position: {
            x: dropX + index * 80,
            y: dropY,
          },
        }));

        await uploadFiles(uploads);
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        if (!containerRef.current) {
          setIsDragOver(false);
          return;
        }
        const nextTarget = event.relatedTarget as Node | null;
        if (nextTarget && containerRef.current.contains(nextTarget)) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right) {
          setIsDragOver(false);
          return;
        }
        if (event.clientY < rect.top || event.clientY > rect.bottom) {
          setIsDragOver(false);
          return;
        }
        setIsDragOver(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: "url(/bliss.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      // onClick={() => {
      //   setIsStartMenuOpen(false);
      // }}
    >
      {files.map((file) => (
        <DesktopFileIcon
          key={file._id}
          file={file}
          onDelete={async (id) => {
            try {
              await deleteFiles({ fileIds: [id] });
            } catch (error) {
              handleError(error);
            }
          }}
        />
      ))}
      {isDragOver ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px dashed rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.1)",
          }}
        />
      ) : null}
    </div>
  );
}
