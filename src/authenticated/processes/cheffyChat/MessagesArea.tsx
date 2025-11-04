import { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble/MessageBubble";
import { useUIMessages } from "@convex-dev/agent/react";
import { api } from "../../../../convex/_generated/api";
import { useCheffyChatContext } from "./useCheffyChatContext";
import { EmptyCheffyState } from "./EmptyCheffyState";

export function MessagesArea() {
  const { process } = useCheffyChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { results: messages } = useUIMessages(
    api.my.cheffy.listThreadMessages,
    process.props.threadId ? { threadId: process.props.threadId } : "skip",
    { initialNumItems: 50, stream: true },
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return <EmptyCheffyState />;

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
        <MessageBubble key={message.key} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
