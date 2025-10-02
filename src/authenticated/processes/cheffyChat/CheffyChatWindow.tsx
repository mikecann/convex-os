import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { useDebounce } from "use-debounce";
import { Process } from "../../../../convex/processes/schema";
import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
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
  const [inputText, setInputText] = useState(process.props.input?.text ?? "");
  const [debouncedInputText] = useDebounce(inputText, 500);
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const isFirstRender = useRef(true);
  const lastSavedText = useRef(process.props.input?.text ?? "");

  // Update from server when process props change, but only if user is not typing
  useEffect(() => {
    const serverText = process.props.input?.text ?? "";
    const isTyping = inputText !== debouncedInputText;

    // Only sync from server if:
    // 1. User is not currently typing (no pending debounced changes)
    // 2. Server text is different from our current debounced text
    // 3. Server text is different from what we last saved (avoid loop)
    if (
      !isTyping &&
      serverText !== debouncedInputText &&
      serverText !== lastSavedText.current
    ) {
      setInputText(serverText);
      lastSavedText.current = serverText;
    }
  }, [process.props.input?.text, inputText, debouncedInputText]);

  // Save to server when debounced input text changes
  useEffect(() => {
    // Skip on first render to avoid saving the initial value
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only save if the debounced text is different from what we last saved
    if (debouncedInputText !== lastSavedText.current) {
      lastSavedText.current = debouncedInputText;
      void updateProcessProps({
        processId: process._id,
        props: {
          input: {
            text: debouncedInputText,
            attachments: process.props.input?.attachments ?? [],
          },
        },
      });
    }
  }, [debouncedInputText, process._id, updateProcessProps]);

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
    </ConnectedWindow>
  );
}
