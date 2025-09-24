import { useEffect, useRef, useState } from "react";
import { Taskbar } from "./taskbar/Taskbar";
import { StartMenu } from "./taskbar/StartMenu";
import { DesktopFiles } from "./files/DesktopFiles";

export function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  return (
    <>
      <DesktopFiles />
      <Taskbar
        onStartClick={() => {
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
      />
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => {
          setIsStartMenuOpen(false);
        }}
      />
    </>
  );
}
