import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SpeechBubble } from "./SpeechBubble";
import { CheffyCharacter } from "./CheffyCharacter";
import { startCheffyChat } from "../processes/startProcessHelpers";

export function CheffyHinter() {
  const startProcess = useMutation(api.my.processes.start);
  const processes = useQuery(api.my.processes.list);

  const hasCheffyChat =
    processes?.some((p) => p.kind === "cheffy_chat") ?? false;
  const isVisible = !hasCheffyChat;

  const handleClick = () => {
    void startProcess({
      process: startCheffyChat(),
    });
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "40px",
        right: "20px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <SpeechBubble message="It looks like you are trying to cook!" />
      <CheffyCharacter />
    </div>
  );
}
