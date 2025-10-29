import { useState, useEffect, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import type { FunctionReference } from "convex/server";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { ChatWindowInputBox } from "./ChatWindowInputBox";
import { EmptyCheffyState } from "./EmptyCheffyState";
import { AttachmentsArea } from "./AttachmentsArea";
import { MessageBubble } from "./MessageBubble";
import { useDebouncedServerSync } from "../../../common/hooks/useDebouncedServerSync";
import { DropZone } from "../../../common/dragDrop/DropZone";
import {
  createDataTypeFilter,
  getDragData,
} from "../../../common/dragDrop/helpers";

export function CheffyChatWindow({
  process,
  window,
}: {
  process: Process<"cheffy_chat">;
  window: Doc<"windows">;
}) {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string; timestamp: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const updateProcessProps = useMutation(api.my.processes.updateProps);
  // Cheffy agent action - using type assertion until TypeScript server refreshes types
  const sendMessageAction = useAction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api as any).cheffy.chat.sendMessage as FunctionReference<"action">,
  );

  const attachments = process.props.input?.attachments ?? [];

  const [inputText, setInputText] = useDebouncedServerSync(
    process.props.input?.text ?? "",
    (text) => {
      void updateProcessProps({
        processId: process._id,
        props: {
          threadId: process.props.threadId,
          input: {
            text,
            attachments,
          },
        },
      });
    },
  );

  // Messages are maintained in client state for this session
  // Thread context is maintained server-side for the agent

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addAttachment = (fileId: Id<"files">) => {
    const newAttachments = [...attachments];
    if (!newAttachments.includes(fileId)) {
      newAttachments.push(fileId);
      void updateProcessProps({
        processId: process._id,
        props: {
          threadId: process.props.threadId,
          input: {
            text: inputText,
            attachments: newAttachments,
          },
        },
      });
    }
  };

  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
    >
      <DropZone
        dropMessage="Drop files here to attach"
        shouldAcceptDrag={createDataTypeFilter("application/x-desktop-file-id")}
        getDropEffect={() => "copy"}
        onDrop={async (event) => {
          const fileId = getDragData(
            event,
            "application/x-desktop-file-id",
          ) as Id<"files">;
          if (fileId) addAttachment(fileId);
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f0f0f0",
          }}
        >
          {/* Messages Area */}
          {messages.length === 0 && !isLoading ? (
            <EmptyCheffyState />
          ) : (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
              }}
            >
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  role={msg.role as "user" | "assistant"}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}
              {isLoading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                  }}
                >
                  <img
                    src="/cheffy.webp"
                    alt="Cheffy"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ fontSize: "13px", color: "#666" }}>
                    Cheffy is thinking...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <div
            style={{
              padding: "8px",
              backgroundColor: "#ece9d8",
            }}
          >
            <AttachmentsArea
              attachmentIds={attachments}
              onRemove={(fileId) => {
                const newAttachments = attachments.filter(
                  (id) => id !== fileId,
                );
                void updateProcessProps({
                  processId: process._id,
                  props: {
                    threadId: process.props.threadId,
                    input: {
                      text: inputText,
                      attachments: newAttachments,
                    },
                  },
                });
              }}
            />

            <ChatWindowInputBox
              message={inputText}
              onMessageChange={setInputText}
              onSend={async (message) => {
                if (!message.trim() && attachments.length === 0) return;

                setIsLoading(true);

                sendMessageAction({
                  processId: process._id,
                  text: message,
                  attachments,
                })
                  .then((newMessages) => {
                    setMessages((prev) => [...prev, ...newMessages]);
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    console.error("Failed to send message:", err);
                    setIsLoading(false);
                  });
              }}
            />
          </div>
        </div>
      </DropZone>
    </ConnectedWindow>
  );
}
