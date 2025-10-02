import { useEffect, useState } from "react";
import { DesktopFiles } from "./files/DesktopFiles";
import { ProcessSystem } from "./processes/ProcessSystem";
import { StartMenu } from "./taskbar/startMenu/StartMenu";
import { Taskbar } from "./taskbar/Taskbar";

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
    </>
  );
}
