import { useRef } from "react";

interface ChatWindowInputBoxProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSend: (message: string) => void;
}

export function ChatWindowInputBox({
  message,
  onMessageChange,
  onSend,
}: ChatWindowInputBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      onMessageChange("");
      if (textareaRef.current) 
        textareaRef.current.style.height = "auto";
      
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMessageChange(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
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
            onChange={handleInput}
            onKeyDown={handleKeyDown}
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
          <button
            type="submit"
            disabled={!message.trim()}
            style={{
              minWidth: "75px",
              height: "23px",
            }}
          >
            Send
          </button>
        </div>
      </form>
   
  );
}
