interface AddressBarProps {
  url: string;
  isLoading: boolean;
  onUrlChange: (url: string) => void;
  onGo: () => void;
}

export function AddressBar({
  url,
  isLoading,
  onUrlChange,
  onGo,
}: AddressBarProps) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        marginLeft: "8px",
        height: "22px",
      }}
    >
      <label
        style={{
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          whiteSpace: "nowrap",
          color: "#000",
        }}
      >
        Address:
      </label>
      <input
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") onGo();
        }}
        style={{
          flex: 1,
          padding: "1px 3px",
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          border: "1px inset #ece9d8",
          backgroundColor: "#fff",
          height: "18px",
        }}
      />
      <button
        onClick={onGo}
        disabled={isLoading}
        style={{
          padding: "1px 8px",
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          cursor: isLoading ? "wait" : "pointer",
          border: "1px outset #ece9d8",
          backgroundColor: "#ece9d8",
          height: "20px",
          marginRight: "2px",
        }}
      >
        Go
      </button>
    </div>
  );
}
