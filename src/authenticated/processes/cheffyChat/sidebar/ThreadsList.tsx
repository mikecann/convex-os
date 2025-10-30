import Box from "../../../../common/components/Box";
import Vertical from "../../../../common/components/Vertical";
import { ThreadItem } from "./ThreadItem";
import { useCheffyChatContext } from "../CheffyChatContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export function ThreadsList() {
  const { process } = useCheffyChatContext();
  const threads = useQuery(api.my.cheffy.listThreads, {
    paginationOpts: { numItems: 100, cursor: null },
  });
  const setThreadId = useMutation(api.my.cheffy.setThreadId);

  const handleThreadSelect = (threadId: string) => {
    void setThreadId({
      processId: process._id,
      threadId,
    });
  };

  if (!threads) return null;

  if (threads.page.length === 0)
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

  return (
    <Vertical gap="2px">
      {threads.page.map((thread) => (
        <ThreadItem
          key={thread._id}
          threadId={thread._id}
          title={thread.title}
          summary={thread.summary}
          isSelected={thread._id === process.props.threadId}
          onSelect={() => {
            handleThreadSelect(thread._id);
          }}
        />
      ))}
    </Vertical>
  );
}
