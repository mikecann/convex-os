import { useEffect, useState } from "react";
import { DesktopFiles } from "./files/desktopFiles/DesktopFiles";
import { ProcessSystem } from "./processes/ProcessSystem";
import { StartMenu } from "./taskbar/startMenu/StartMenu";
import { Taskbar } from "./taskbar/Taskbar";
import { CheffyHinter } from "./cheffy/CheffyHinter";

export function AuthenticatedContent() {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);

  return (
    <>
      <DesktopFiles />
      <ProcessSystem />
      {isStartMenuVisible && (
        <StartMenu
          isOpen={isStartMenuVisible}
          onClose={() => setIsStartMenuVisible(false)}
        />
      )}
      <Taskbar
        onStartClick={() => setIsStartMenuVisible((current) => !current)}
      />
      <CheffyHinter />
    </>
  );
}
