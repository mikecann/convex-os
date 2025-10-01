import { useState, useEffect } from "react";

export function Cheffy() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDancing, setIsDancing] = useState(false);

  useEffect(() => {
    const danceInterval = setInterval(() => {
      setIsDancing(true);
      setTimeout(() => setIsDancing(false), 1000);
    }, 5000);

    return () => clearInterval(danceInterval);
  }, []);

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
      {/* Speech Bubble */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffd4",
          border: "1px solid #000",
          borderRadius: "8px",
          padding: "12px 16px",
          maxWidth: "200px",
          boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.3)",
          marginBottom: "-0px",
          zIndex: 2,
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "auto",
            height: "auto",
            minWidth: "0",
            minHeight: "0",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "0",
            margin: "0",
            lineHeight: 1,
            color: "#666",
            boxShadow: "none",
            outline: "none",
            background: "transparent",
            backgroundImage: "none",
          }}
          aria-label="Close"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#000";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#666";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          ×
        </button>

        {/* Speech bubble text */}
        <div
          style={{
            fontFamily: "Tahoma, sans-serif",
            fontSize: "12px",
            color: "#000",
            lineHeight: "1.4",
            fontWeight: "bold",
            paddingRight: "20px",
            userSelect: "none",
          }}
        >
          It looks like you want to cook!
        </div>

        {/* Speech bubble pointer */}
        <div
          style={{
            position: "absolute",
            bottom: "-12px",
            right: "30px",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "12px solid #000",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            right: "32px",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "10px solid #ffffd4",
          }}
        />
      </div>

      {/* Cheffy character */}
      <div
        style={{
          width: "120px",
          height: "120px",
          marginRight: "10px",
          animation: isDancing ? "cheffy-dance 1s ease-in-out" : "none",
        }}
      >
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
    </div>
  );
}
