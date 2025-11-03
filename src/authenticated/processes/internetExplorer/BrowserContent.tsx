import { RefObject } from "react";

interface BrowserContentProps {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  url: string;
  isLoading: boolean;
  onLoad: () => void;
}

export function BrowserContent({
  iframeRef,
  url,
  isLoading,
  onLoad,
}: BrowserContentProps) {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontFamily: "Tahoma, sans-serif",
              color: "#666",
            }}
          >
            Loading...
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        onLoad={onLoad}
      />
    </div>
  );
}

