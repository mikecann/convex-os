interface SpeechBubbleProps {
  message: string;
  onClose: () => void;
}

export function SpeechBubble({ message, onClose }: SpeechBubbleProps) {
  return (
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
      <CloseButton onClick={onClose} />
      <Message message={message} />
      <SpeechBubblePointer />
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
  );
}

function Message({ message }: { message: string }) {
  return (
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
      {message}
    </div>
  );
}

function SpeechBubblePointer() {
  return (
    <>
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
    </>
  );
}
