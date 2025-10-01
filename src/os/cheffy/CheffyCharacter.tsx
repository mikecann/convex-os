import { useState, useEffect } from "react";

export function CheffyCharacter({}: {}) {
  const [isDancing, setIsDancing] = useState(false);

  useEffect(() => {
    const danceInterval = setInterval(() => {
      setIsDancing(true);
      setTimeout(() => setIsDancing(false), 1000);
    }, 5000);

    return () => clearInterval(danceInterval);
  }, []);

  return (
    <div
      style={{
        width: "120px",
        height: "120px",
        marginRight: "10px",
        animation: isDancing ? "cheffy-dance 1s ease-in-out" : "none",
      }}
    >
      <DanceAnimation />
      <img
        src="/cheffy.webp"
        alt="Cheffy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "auto",
        }}
      />
    </div>
  );
}

function DanceAnimation() {
  return (
    <style>
      {`
        @keyframes cheffy-dance {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-3px, -3px) rotate(-5deg); }
          20% { transform: translate(3px, -2px) rotate(5deg); }
          30% { transform: translate(-3px, 2px) rotate(-3deg); }
          40% { transform: translate(3px, -3px) rotate(3deg); }
          50% { transform: translate(-2px, 3px) rotate(-4deg); }
          60% { transform: translate(2px, -3px) rotate(4deg); }
          70% { transform: translate(-3px, 2px) rotate(-2deg); }
          80% { transform: translate(3px, 2px) rotate(2deg); }
          90% { transform: translate(-2px, -2px) rotate(-1deg); }
        }
      `}
    </style>
  );
}
