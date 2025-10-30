import Box from "../../../../common/components/Box";
import Vertical from "../../../../common/components/Vertical";
import { ThreadItem } from "./ThreadItem";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface ThreadsListProps {
  threads:
    | {
        _id: string;
        _creationTime: number;
        status: "active" | "archived";
        summary?: string | undefined;
        title?: string | undefined;
        userId?: string | undefined;
      }[]
    | undefined;
  currentThreadId: string | undefined;
  onThreadSelect: (threadId: string) => void;
  processId: Id<"processes">;
}

export function ThreadsList({
  threads,
  currentThreadId,
  onThreadSelect,
  processId,
}: ThreadsListProps) {
  const updateProcessProps = useMutation(api.my.processes.updateProps);

  if (threads === undefined) {
    return (
      <Box
        padding="8px"
        style={{
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          color: "#666",
        }}
      >
        Loading...
      </Box>
    );
  }

  if (threads.length === 0) {
    return (
      <Box
        padding="8px"
        style={{
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          color: "#666",
        }}
      >
        No threads yet
      </Box>
    );
  }

  return (
    <Vertical gap="2px">
      {threads.map((thread) => (
        <ThreadItem
          key={thread._id}
          threadId={thread._id}
          title={thread.title}
          summary={thread.summary}
          isSelected={thread._id === currentThreadId}
          onSelect={() => {
            onThreadSelect(thread._id);
            void updateProcessProps({
              processId,
              props: {
                threadId: thread._id,
              },
            });
          }}
        />
      ))}
    </Vertical>
  );
}

