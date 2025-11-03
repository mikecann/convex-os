import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { playSound } from "../../../common/sounds/soundEffects";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import { MenuItem, StartMenuProps } from "./types";
import { StartMenuUserHeader } from "./StartMenuUserHeader";
import { StartMenuLeftColumn } from "./StartMenuLeftColumn";
import { StartMenuRightColumn } from "./StartMenuRightColumn";
import { StartMenuBottomButtons } from "./StartMenuBottomButtons";
import { leftMenuItems, rightMenuItems } from "./menuItems";
import {
  startImagePreview,
  startVideoPlayer,
  startTextPreview,
  startCheffyChat,
  startInternetExplorer,
} from "../../processes/startProcessHelpers";
import { useStartCenteredApp } from "../../processes/useStartCenteredApp";

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const { signOut } = useAuthActions();
  const user = useQuery(api.my.user.find);
  const startCenteredApp = useStartCenteredApp();
  const onError = useErrorHandler();

  if (!isOpen) return null;

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
      onClose();
      return;
    }

    if (item.processKind) {
      let processParams;
      if (item.processKind === "image_preview")
        processParams = startImagePreview();
      else if (item.processKind === "video_player")
        processParams = startVideoPlayer();
      else if (item.processKind === "text_preview")
        processParams = startTextPreview();
      else if (item.processKind === "cheffy_chat")
        processParams = startCheffyChat();
      else if (item.processKind === "internet_explorer")
        processParams = startInternetExplorer();

      if (processParams) void startCenteredApp(processParams);

      onClose();
      return;
    }

    onError("This feature does nothing right now");
  };

  const userName = user?.name || user?.email || "User";

  return (
    <>
      {/* Backdrop to close menu when clicked outside */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10001,
        }}
        onClick={onClose}
      />

      {/* Start Menu */}
      <div
        style={{
          position: "fixed",
          bottom: "38px",
          left: "2px",
          width: "385px",
          height: "425px",
          background: "#245EDC",
          border: "3px ridge #C0C0C0",
          borderBottomColor: "#404040",
          borderRightColor: "#404040",
          borderRadius: "8px 8px 0 0",
          boxShadow: "4px 0 10px rgba(0, 0, 0, 0.5)",
          zIndex: 10002,
          overflow: "hidden",
          fontFamily: "MS Sans Serif, Arial, sans-serif",
        }}
      >
        <StartMenuUserHeader userName={userName} />

        {/* Main menu content */}
        <div
          style={{
            display: "flex",
            height: "325px",
            overflow: "hidden",
          }}
        >
          <StartMenuLeftColumn
            items={leftMenuItems}
            onItemClick={handleMenuItemClick}
            onAllProgramsClick={() => {
              onError("This feature does nothing right now");
            }}
          />
          <StartMenuRightColumn
            items={rightMenuItems}
            onItemClick={handleMenuItemClick}
          />
        </div>

        <StartMenuBottomButtons
          onLogOff={() => {
            playSound("logoff", 0.4);
            void signOut();
            onClose();
          }}
          onTurnOff={() => {
            playSound("shutdown", 0.4);
            setTimeout(() => {
              window.close();
            }, 500);
            onClose();
          }}
        />
      </div>
    </>
  );
}
