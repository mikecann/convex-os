import { DesktopFiles } from "./desktop/files/DesktopFiles";
import { useState } from "react";
import { StartMenu } from "./desktop/taskbar/StartMenu";
import { Taskbar } from "./desktop/taskbar/Taskbar";
import { ProcessSystem } from "./os/ProcessSystem";

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
