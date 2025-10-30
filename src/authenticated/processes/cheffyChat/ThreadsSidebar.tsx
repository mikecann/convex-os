import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import type { FunctionReference } from "convex/server";
import { Id } from "../../../../convex/_generated/dataModel";

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
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const threads = useQuery(
    api.cheffy.chat.listThreads,
    isOpen
      ? {
          paginationOpts: { numItems: 100, cursor: null },
        }
      : "skip",
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "250px",
        backgroundColor: "#ECE9D8",
        borderRight: "1px solid #919B9C",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: "8px",
          borderBottom: "1px solid #919B9C",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          Threads
        </span>
        <button
          onClick={onClose}
          style={{
            padding: "2px 8px",
            border: "1px solid #919B9C",
            background: "#ECE9D8",
            cursor: "pointer",
            fontSize: "11px",
            fontFamily: "Tahoma, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#D1E9FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ECE9D8";
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px",
        }}
      >
        {threads === undefined ? (
          <div
            style={{
              padding: "8px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
              color: "#666",
            }}
          >
            Loading...
          </div>
        ) : threads.page.length === 0 ? (
          <div
            style={{
              padding: "8px",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
              color: "#666",
            }}
          >
            No threads yet
          </div>
        ) : (
          threads.page.map((thread) => (
            <div
              key={thread._id}
              onClick={() => {
                onThreadSelect(thread._id);
                void updateProcessProps({
                  processId,
                  props: {
                    threadId: thread._id,
                  },
                });
              }}
              style={{
                padding: "8px",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: "Tahoma, sans-serif",
                backgroundColor:
                  thread._id === currentThreadId ? "#D1E9FF" : "transparent",
                border: "1px solid transparent",
                borderRadius: "2px",
                marginBottom: "2px",
              }}
              onMouseEnter={(e) => {
                if (thread._id !== currentThreadId) {
                  e.currentTarget.style.background = "#f0f0f0";
                  e.currentTarget.style.border = "1px solid #919B9C";
                }
              }}
              onMouseLeave={(e) => {
                if (thread._id !== currentThreadId) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.border = "1px solid transparent";
                }
              }}
            >
              <div
                style={{
                  fontWeight:
                    thread._id === currentThreadId ? "bold" : "normal",
                  marginBottom: "4px",
                }}
              >
                {thread.title || "Untitled Thread"}
              </div>
              {thread.summary && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {thread.summary}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
