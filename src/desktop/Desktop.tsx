import { useState } from "react";
import { Taskbar, StartMenu } from "./taskbar";

export function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const handleStartMenuClose = () => {
    setIsStartMenuOpen(false);
  };

  return (
    <>
      <Taskbar onStartClick={handleStartClick} />
      <StartMenu isOpen={isStartMenuOpen} onClose={handleStartMenuClose} />
    </>
  );
}
