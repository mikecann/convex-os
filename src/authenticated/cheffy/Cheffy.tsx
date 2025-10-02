import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SpeechBubble } from "./SpeechBubble";
import { CheffyCharacter } from "./CheffyCharacter";

export function Cheffy() {
  const [isVisible, setIsVisible] = useState(true);
  const startProcess = useMutation(api.my.processes.start);

  const handleClick = () => {
    void startProcess({
      process: {
        kind: "cheffy_chat",
        props: {},
        windowCreationParams: {
          x: 100,
          y: 100,
          width: 600,
          height: 400,
          title: "Cheffy Chat",
          icon: "/cheffy.webp",
        },
      },
    });
    setIsVisible(false);
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
      <SpeechBubble
        message="It looks like you are trying to cook!"
        onClose={() => setIsVisible(false)}
      />
      <CheffyCharacter />
    </div>
  );
}
