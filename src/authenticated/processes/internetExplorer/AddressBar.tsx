import { Button } from "../../../common/components/Button";

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
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        Address:
        <img
          src="/xp/ie.png"
          alt=""
          style={{
            width: "16px",
            height: "16px",
            imageRendering: "pixelated",
          }}
        />
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
      <Button
        onClick={onGo}
        disabled={isLoading}
        style={{
          padding: "1px 4px",
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          cursor: isLoading ? "wait" : "pointer",
          border: "1px outset #ece9d8",
          backgroundColor: "#ece9d8",
          height: "20px",
          marginRight: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Go"
      >
        <img
          src="/xp/toolbar/go.png"
          alt="Go"
          style={{
            width: "16px",
            height: "16px",
            imageRendering: "pixelated",
          }}
        />
      </Button>
    </div>
  );
}
