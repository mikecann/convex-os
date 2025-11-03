import { ToolbarButton } from "./ToolbarButton";
import { AddressBar } from "./AddressBar";
import { LinksBar } from "./LinksBar";

interface StandardToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onStop: () => void;
  onRefresh: () => void;
  onHome: () => void;
}

export function StandardToolbar({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onStop,
  onRefresh,
  onHome,
}: StandardToolbarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "2px",
        borderBottom: "1px solid #8b8b8b",
        backgroundColor: "#ece9d8",
        flexShrink: 0,
      }}
    >
      <ToolbarButton
        onClick={onBack}
        disabled={!canGoBack}
        title="Back"
        icon={<span style={{ color: canGoBack ? "#008000" : "#888" }}>◀</span>}
      />
      <ToolbarButton
        onClick={onForward}
        disabled={!canGoForward}
        title="Forward"
        icon={
          <span style={{ color: canGoForward ? "#008000" : "#888" }}>▶</span>
        }
      />
      <ToolbarButton
        onClick={onStop}
        title="Stop"
        icon={<span style={{ color: "#c00", fontSize: "14px" }}>✕</span>}
      />
      <ToolbarButton
        onClick={onRefresh}
        title="Refresh"
        icon={<span style={{ color: "#008000", fontSize: "12px" }}>↻</span>}
      />
      <ToolbarButton
        onClick={onHome}
        title="Home"
        icon={<span style={{ fontSize: "14px" }}>⌂</span>}
      />
      <ToolbarButton
        title="Search"
        icon={<span style={{ fontSize: "12px" }}>🔍</span>}
      />
      <ToolbarButton
        title="Favorites"
        icon={<span style={{ fontSize: "12px", color: "#ffd700" }}>★</span>}
      />

      <LinksBar />
    </div>
  );
}
