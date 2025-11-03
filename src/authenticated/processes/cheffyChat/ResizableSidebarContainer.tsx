import { useRef, useEffect, useLayoutEffect, type RefObject } from "react";
import { ThreadsSidebar } from "./sidebar/ThreadsSidebar";
import { useCheffyChatContext } from "./useCheffyChatContext";
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
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const currentWidthRef = useRef(process.props.sidebar.width);

  useEffect(() => {
    currentWidthRef.current = process.props.sidebar.width;
  }, [process.props.sidebar.width]);

  useLayoutEffect(() => {
    if (isResizingRef.current || !sidebarRef.current) return;
    sidebarRef.current.style.width = `${process.props.sidebar.width}px`;
  }, [process.props.sidebar.width]);

  if (!process.props.sidebar.isOpen) return null;

  return (
    <>
      <ThreadsSidebar
        width={process.props.sidebar.width}
        sidebarRef={sidebarRef}
      />
      <div
        onMouseDown={() => {
          if (!containerRef.current || !sidebarRef.current) return;
          isResizingRef.current = true;

          const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !sidebarRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const newWidth = e.clientX - containerRect.left;

            if (newWidth >= 200 && newWidth <= 600) {
              currentWidthRef.current = newWidth;
              sidebarRef.current.style.width = `${newWidth}px`;
            }
          };

          const handleMouseUp = () => {
            isResizingRef.current = false;
            void setSidebarWidthMutation({
              processId: process._id,
              width: currentWidthRef.current,
            });
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
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
