import { useState, useEffect } from "react";
import { SpeechBubble } from "./SpeechBubble";
import { CheffyCharacter } from "./CheffyCharacter";

export function Cheffy() {
  const [isVisible, setIsVisible] = useState(true);

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
      }}
    >
      <SpeechBubble
        message="It looks like you are trying to cook!"
        onClose={() => setIsVisible(false)}
      />
      <CheffyCharacter />
    </div>
  );
}
