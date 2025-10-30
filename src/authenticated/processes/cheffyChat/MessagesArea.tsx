import { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { EmptyCheffyState } from "./EmptyCheffyState";
import { useUIMessages } from "@convex-dev/agent/react";
import type { UIMessage } from "@convex-dev/agent";
import { api } from "../../../../convex/_generated/api";
import { useCheffyChatContext } from "./CheffyChatContext";

export function MessagesArea() {
  const { process, isLoading } = useCheffyChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { results: messages } = useUIMessages(
    api.my.cheffy.listThreadMessages,
    process.props.threadId ? { threadId: process.props.threadId } : "skip",
    { initialNumItems: 50 },
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!process.props.threadId && !isLoading) return <EmptyCheffyState />;

  if (messages.length === 0 && !isLoading) return <EmptyCheffyState />;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        minHeight: 0,
      }}
    >
      {messages.map((message) => (
        <MessageBubble
          key={(message as UIMessage).key}
          role={(message as UIMessage).role as "user" | "assistant"}
          content={(message as UIMessage).text}
          timestamp={(message as UIMessage)._creationTime}
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
  );
}
