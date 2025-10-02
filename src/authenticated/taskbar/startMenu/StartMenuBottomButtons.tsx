interface StartMenuBottomButtonsProps {
  onLogOff: () => void;
  onTurnOff: () => void;
}

export function StartMenuBottomButtons({
  onLogOff,
  onTurnOff,
}: StartMenuBottomButtonsProps) {
  return (
    <div
      style={{
        height: "35px",
        background:
          "linear-gradient(to bottom, #588bf9 0%, #1354e1 30%, #2E5BDC 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        borderTop: "1px solid rgba(255,255,255,0.3)",
        gap: "4px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
          cursor: "pointer",
          background: "none",
          border: "none",
          borderRadius: "2px",
          fontSize: "11px",
          fontFamily: "MS Sans Serif, Arial, sans-serif",
          color: "white",
        }}
        onClick={onLogOff}
        onMouseDown={(e) => {
          e.currentTarget.style.border = "none";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.border = "none";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "none";
        }}
      >
        <img
          src="/xp/logoff.png"
          alt="Log Off"
          style={{ width: "16px", height: "16px" }}
        />
        <span>Log Off</span>
      </button>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
          cursor: "pointer",
          background: "none",
          border: "none",
          borderRadius: "2px",
          fontSize: "11px",
          fontFamily: "MS Sans Serif, Arial, sans-serif",
          color: "white",
        }}
        onClick={onTurnOff}
        onMouseDown={(e) => {
          e.currentTarget.style.border = "none";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.border = "none";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = "none";
        }}
      >
        <img
          src="/xp/shutdown.png"
          alt="Turn Off"
          style={{ width: "16px", height: "16px" }}
        />
        <span>Turn Off Computer</span>
      </button>
    </div>
  );
}

