import React from "react";

interface WallpaperProps {
  children?: React.ReactNode;
  fullScreen?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Wallpaper({
  children,
  fullScreen = false,
  style,
  className = "",
}: WallpaperProps) {
  const wallpaperStyle: React.CSSProperties = {
    backgroundImage: "url(/bliss.webp)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: fullScreen ? "100%" : "auto",
    width: fullScreen ? "100%" : "auto",
    height: fullScreen ? "100%" : "auto",
    ...style,
  };

  return (
    <div className={className} style={wallpaperStyle}>
      {children}
    </div>
  );
}
