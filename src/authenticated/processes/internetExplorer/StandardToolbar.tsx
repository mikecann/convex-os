import { ToolbarButton } from "./ToolbarButton";
import { AddressBar } from "./AddressBar";
import { LinksBar } from "./LinksBar";

interface StandardToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  url: string;
  isLoading: boolean;
  onBack: () => void;
  onForward: () => void;
  onStop: () => void;
  onRefresh: () => void;
  onHome: () => void;
  onUrlChange: (url: string) => void;
  onGo: () => void;
}

function ToolbarSeparator() {
  return (
    <div
      style={{
        width: "1px",
        height: "20px",
        backgroundColor: "#8b8b8b",
        margin: "5px 2px",
        flexShrink: 0,
        alignSelf: "center",
      }}
    />
  );
}

export function StandardToolbar({
  canGoBack,
  canGoForward,
  url,
  isLoading,
  onBack,
  onForward,
  onStop,
  onRefresh,
  onHome,
  onUrlChange,
  onGo,
}: StandardToolbarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ece9d8",
        borderBottom: "1px solid #8b8b8b",
        flexShrink: 0,
      }}
    >
      {/* Top row - Navigation buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "2px",
          padding: "4px 2px",
          flexWrap: "nowrap",
        }}
      >
        <ToolbarButton
          onClick={onBack}
          disabled={!canGoBack}
          title="Back"
          iconSrc="/xp/toolbar/back.png"
        />
        <ToolbarButton
          onClick={onForward}
          disabled={!canGoForward}
          title="Forward"
          iconSrc="/xp/toolbar/forward.png"
        />
        <ToolbarSeparator />
        <ToolbarButton
          onClick={onStop}
          title="Stop"
          iconSrc="/xp/toolbar/removepaper.png"
        />
        <ToolbarButton
          onClick={onRefresh}
          title="Refresh"
          iconSrc="/xp/toolbar/recyclepaper.png"
        />
        <ToolbarSeparator />
        <ToolbarButton
          onClick={onHome}
          title="Home"
          iconSrc="/xp/toolbar/home.png"
        />
        <ToolbarButton title="Search" iconSrc="/xp/toolbar/search.png" />
        <ToolbarButton title="Favorites" iconSrc="/xp/toolbar/star.png" />
      </div>

      {/* Bottom row - Address bar and Links bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "2px",
          borderTop: "1px solid #c3c3c3",
        }}
      >
        <AddressBar
          url={url}
          isLoading={isLoading}
          onUrlChange={onUrlChange}
          onGo={onGo}
        />
        <LinksBar />
      </div>
    </div>
  );
}
