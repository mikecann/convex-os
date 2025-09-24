import { useState } from "react";
import { Taskbar } from "./taskbar/Taskbar";
import { StartMenu } from "./taskbar/StartMenu";

export function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  return (
    <>
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
