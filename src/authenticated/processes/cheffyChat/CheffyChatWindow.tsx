import { useState } from "react";
import { useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { ChatWindowInputBox } from "./ChatWindowInputBox";
import { EmptyCheffyState } from "./EmptyCheffyState";
import { AttachmentsArea } from "./AttachmentsArea";
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
    Array<{ role: string; content: string }>
  >([]);
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const attachments = process.props.input?.attachments ?? [];

  const [inputText, setInputText] = useDebouncedServerSync(
    process.props.input?.text ?? "",
    (text) => {
      void updateProcessProps({
        processId: process._id,
        props: {
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
          input: {
            text: inputText,
            attachments: newAttachments,
          },
        },
      });
    }
  };

  const removeAttachment = (fileId: Id<"files">) => {
    const newAttachments = attachments.filter((id) => id !== fileId);
    void updateProcessProps({
      processId: process._id,
      props: {
        input: {
          text: inputText,
          attachments: newAttachments,
        },
      },
    });
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
          if (fileId) {
            addAttachment(fileId);
          }
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
          {messages.length === 0 ? (
            <EmptyCheffyState />
          ) : (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
              }}
            >
              {/* TODO: Render messages */}
              {messages.map((msg, idx) => (
                <div key={idx}>{msg.content}</div>
              ))}
            </div>
          )}

          <div
            style={{
              padding: "8px",
              backgroundColor: "#ece9d8",
            }}
          >
            {/* Attachments Area */}
            <AttachmentsArea
              attachmentIds={attachments}
              onRemove={removeAttachment}
            />

            {/* Input Box */}
            <ChatWindowInputBox
              message={inputText}
              onMessageChange={setInputText}
              onSend={(message) => {
                // TODO: Implement message sending
                console.log("Message:", message);
                setMessages([...messages, { role: "user", content: message }]);
              }}
            />
          </div>
        </div>
      </DropZone>
    </ConnectedWindow>
  );
}
