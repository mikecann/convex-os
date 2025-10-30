import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import type { FunctionReference } from "convex/server";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { ChatWindowInputBox } from "./ChatWindowInputBox";
import { AttachmentsArea } from "./AttachmentsArea";
import { MessagesArea } from "./MessagesArea";
import { ThreadsSidebar } from "./ThreadsSidebar";
import { MenuBar } from "../../../common/components/MenuBar";
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
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const updateProcessProps = useMutation(api.my.processes.updateProps);
  // Cheffy agent action - using type assertion until TypeScript server refreshes types
  const sendMessageAction = useAction(api.cheffy.chat.sendMessage);

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
      bodyStyle={{
        marginTop: 0,
      }}
    >
      <MenuBar
        items={[
          {
            label: "View",
            items: [
              {
                label: "Threads",
                onClick: () => {
                  setSidebarOpen((prev) => !prev);
                },
              },
            ],
          },
        ]}
      />
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
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            position: "relative",
          }}
        >
          <ThreadsSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentThreadId={process.props.threadId}
            onThreadSelect={(threadId) => {
              void updateProcessProps({
                processId: process._id,
                props: {
                  threadId,
                  input: process.props.input,
                },
              });
            }}
            processId={process._id}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              marginLeft: sidebarOpen ? "250px" : 0,
              transition: "margin-left 0.2s",
              minWidth: 0,
            }}
          >
            {/* Messages Area */}
            <MessagesArea
              threadId={process.props.threadId}
              isLoading={isLoading}
            />

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
                    .then(() => {
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
        </div>
      </DropZone>
    </ConnectedWindow>
  );
}
