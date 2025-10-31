import { UIMessage } from "@convex-dev/agent";

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          maxWidth: "80%",
          flexDirection: isUser ? "row-reverse" : "row",
        }}
      >
        {!isUser && (
          <img
            src="/cheffy.webp"
            alt="Cheffy"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
        )}
        <div
          style={{
            backgroundColor: isUser ? "#0078d7" : "#ffffff",
            color: isUser ? "#ffffff" : "#000000",
            padding: "8px 12px",
            borderRadius: "12px",
            border: isUser ? "none" : "1px solid #dfdfdf",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            fontSize: "13px",
            lineHeight: "1.4",
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.text}
        </div>
      </div>
      {message._creationTime && (
        <span
          style={{
            fontSize: "11px",
            color: "#666",
            marginTop: "4px",
            marginLeft: isUser ? "0" : "40px",
            marginRight: isUser ? "0" : "0",
          }}
        >
          {new Date(message._creationTime).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
