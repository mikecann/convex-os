import { useState } from "react";
import { Taskbar } from "./taskbar/Taskbar";
import { StartMenu } from "./taskbar/StartMenu";
import { DesktopFiles } from "./files/DesktopFiles";
import { WindowingManager } from "../windowing/WindowingManager";

export function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      <div style={{ flex: "1 1 auto", position: "relative" }}>
        <DesktopFiles />
        <WindowingManager />
      </div>
      <Taskbar
        onStartClick={() => {
          setIsStartMenuOpen((current) => !current);
        }}
      />
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => {
          setIsStartMenuOpen(false);
        }}
      />
    </div>
  );
}
