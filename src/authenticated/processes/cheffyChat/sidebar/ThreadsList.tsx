import Box from "../../../../common/components/Box";
import Vertical from "../../../../common/components/Vertical";
import { ThreadItem } from "./ThreadItem";
import { useCheffyChatContext } from "../useCheffyChatContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export function ThreadsList() {
  const { process } = useCheffyChatContext();
  const threads = useQuery(api.my.cheffy.listThreads, {
    paginationOpts: { numItems: 100, cursor: null },
  });
  const setThreadId = useMutation(api.my.cheffy.setThreadId);
  const deleteThread = useMutation(api.my.cheffy.deleteThread);
  const createThread = useMutation(api.my.cheffy.createThread);

  const handleThreadSelect = (threadId: string) => {
    void setThreadId({
      processId: process._id,
      threadId,
    });
  };

  if (!threads) return null;

  if (threads.page.length === 0)
    return (
      <Vertical gap="8px">
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
        <button
          onClick={() => {
            void createThread({ processId: process._id });
          }}
          style={{
            width: "100%",
            height: "auto",
            minWidth: "0",
            minHeight: "0",
            background: "none",
            border: "1px solid #919B9C",
            cursor: "pointer",
            padding: "6px 8px",
            margin: "0 4px",
            fontSize: "11px",
            fontFamily: "Tahoma, sans-serif",
            lineHeight: "1",
            color: "#333",
            boxShadow: "none",
            outline: "none",
            backgroundColor: "transparent",
            borderRadius: "2px",
          }}
          title="New thread"
        >
          + New Thread
        </button>
      </Vertical>
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
          onDelete={() => {
            void deleteThread({
              processId: process._id,
              threadId: thread._id,
            });
          }}
        />
      ))}
      <button
        onClick={() => {
          void createThread({ processId: process._id });
        }}
        style={{
          width: "100%",
          height: "auto",
          minWidth: "0",
          minHeight: "0",
          background: "none",
          border: "1px solid #919B9C",
          cursor: "pointer",
          padding: "6px 8px",
          margin: "4px",
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          lineHeight: "1",
          color: "#333",
          boxShadow: "none",
          outline: "none",
          backgroundColor: "transparent",
          borderRadius: "2px",
        }}
        title="New thread"
      >
        + New Thread
      </button>
    </Vertical>
  );
}
