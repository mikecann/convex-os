import { DotLoader } from "react-spinners";
import { UIMessage, useSmoothText } from "@convex-dev/agent/react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AttachmentChip } from "./AttachmentChip";

export function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const isFailed = !isUser && message.status === "failed";
  const isStreaming =
    !isUser &&
    !isFailed &&
    (message.status === "pending" ||
      (!message.text && message.status !== "success"));
  const [visibleText] = useSmoothText(message.text, {
    startStreaming: message.status === "pending",
  });

  const metadata = useQuery(
    api.my.cheffy.getMessageMetadata,
    isUser && message.id ? { messageId: message.id } : "skip",
  );

  const messageError = useQuery(
    api.my.cheffy.getMessageError,
    isFailed && message.id ? { messageId: message.id } : "skip",
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
      }}
    >
      {isUser && metadata && metadata.fileIds.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "8px",
            maxWidth: "80%",
            justifyContent: "flex-end",
          }}
        >
          {metadata.fileIds.map((fileId) => (
            <AttachmentChip key={fileId} fileId={fileId} />
          ))}
        </div>
      )}
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
            backgroundColor: isFailed
              ? "#ffebee"
              : isUser
                ? "#0078d7"
                : "#ffffff",
            color: isFailed ? "#c62828" : isUser ? "#ffffff" : "#000000",
            padding: "8px 12px",
            borderRadius: "12px",
            border: isFailed
              ? "1px solid #c62828"
              : isUser
                ? "none"
                : "1px solid #dfdfdf",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            fontSize: "13px",
            lineHeight: "1.4",
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            minHeight: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isStreaming && !visibleText ? (
            <DotLoader
              color="#666"
              size={8}
              speedMultiplier={0.8}
              cssOverride={{
                display: "flex",
                alignItems: "center",
              }}
            />
          ) : isFailed ? (
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                Error
              </div>
              <div>{messageError || "An error occurred"}</div>
            </div>
          ) : (
            visibleText
          )}
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
