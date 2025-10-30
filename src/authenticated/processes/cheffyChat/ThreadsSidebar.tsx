import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Vertical from "../../../common/components/Vertical";
import Box from "../../../common/components/Box";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { ThreadsList } from "./sidebar/ThreadsList";

interface ThreadsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentThreadId: string | undefined;
  onThreadSelect: (threadId: string) => void;
  processId: Id<"processes">;
}

export function ThreadsSidebar({
  isOpen,
  onClose,
  currentThreadId,
  onThreadSelect,
  processId,
}: ThreadsSidebarProps) {
  const threads = useQuery(
    api.my.cheffy.listThreads,
    isOpen
      ? {
          paginationOpts: { numItems: 100, cursor: null },
        }
      : "skip",
  );

  if (!isOpen) return null;

  return (
    <Vertical
      width="250px"
      background="#ECE9D8"
      style={{
        flexShrink: 0,
        borderRight: "1px solid #919B9C",
        minHeight: 0,
      }}
    >
      <SidebarHeader title="Threads" onClose={onClose} />
      <Box
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px",
        }}
      >
        <ThreadsList
          threads={threads?.page}
          currentThreadId={currentThreadId}
          onThreadSelect={onThreadSelect}
          processId={processId}
        />
      </Box>
    </Vertical>
  );
}
