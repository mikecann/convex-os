import { useState } from "react";
import { Process } from "../../../../convex/processes/schema";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { ChatWindowInputBox } from "./ChatWindowInputBox";
import { EmptyCheffyState } from "./EmptyCheffyState";

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

  const handleSend = (message: string) => {
    // TODO: Implement message sending
    console.log("Message:", message);
    setMessages([...messages, { role: "user", content: message }]);
  };

  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
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

        {/* Input Box */}
        <ChatWindowInputBox onSend={handleSend} />
      </div>
    </ConnectedWindow>
  );
}
