import { useRef, useEffect, type RefObject } from "react";
import { ThreadsSidebar } from "./sidebar/ThreadsSidebar";
import { useCheffyChatContext } from "./CheffyChatContext";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface ResizableSidebarContainerProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function ResizableSidebarContainer({
  containerRef,
}: ResizableSidebarContainerProps) {
  const { process } = useCheffyChatContext();
  const setSidebarWidthMutation = useMutation(api.my.cheffy.setSidebarWidth);
  const toggleSidebar = useMutation(api.my.cheffy.toggleSidebar);
  const isResizingRef = useRef(false);

  useEffect(() => {
    if (!isResizingRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;

      if (newWidth >= 200 && newWidth <= 600)
        void setSidebarWidthMutation({
          processId: process._id,
          width: newWidth,
        });
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  if (!process.props.sidebar.isOpen) return null;

  return (
    <>
      <ThreadsSidebar width={process.props.sidebar.width} />
      <div
        onMouseDown={() => {
          isResizingRef.current = true;
        }}
        style={{
          width: "4px",
          cursor: "col-resize",
          flexShrink: 0,
          userSelect: "none",
        }}
      />
    </>
  );
}
