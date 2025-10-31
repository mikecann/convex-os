import { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { useUIMessages } from "@convex-dev/agent/react";
import { api } from "../../../../convex/_generated/api";
import { useCheffyChatContext } from "./CheffyChatContext";

export function MessagesArea() {
  const { process } = useCheffyChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { results: messages } = useUIMessages(
    api.my.cheffy.listThreadMessages,
    process.props.threadId ? { threadId: process.props.threadId } : "skip",
    { initialNumItems: 50 },
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
