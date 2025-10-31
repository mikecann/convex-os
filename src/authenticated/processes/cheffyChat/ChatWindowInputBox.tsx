import { useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebouncedServerSync } from "../../../common/hooks/useDebouncedServerSync";
import { useOptimisticSendMessage } from "../../../common/hooks/optimistic";
import { useCheffyChatContext } from "./CheffyChatContext";
import { Button } from "../../../common/components/Button";

export function ChatWindowInputBox() {
  const { process } = useCheffyChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateText = useMutation(api.my.cheffy.updateText);
  const sendMessage = useOptimisticSendMessage();

  const [message, setMessage] = useDebouncedServerSync(
    process.props.input?.text ?? "",
    (text) => {
      void updateText({
        processId: process._id,
        text,
      });
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    await updateText({
      processId: process._id,
      text,
    });

    setMessage("");

    void sendMessage({
      processId: process._id,
    });

    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="field-row"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            // Auto-resize textarea
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask Cheffy anything about cooking..."
          style={{
            flex: 1,
            padding: "4px",
            fontSize: "13px",
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            lineHeight: "1.4",
            maxHeight: "150px",
            overflow: "auto",
            resize: "none",
          }}
          rows={3}
        />
        <Button
          type="submit"
          disabled={!message.trim()}
          style={{
            minWidth: "75px",
            height: "23px",
          }}
        >
          Send
        </Button>
      </div>
    </form>
  );
}
