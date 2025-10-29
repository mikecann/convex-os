import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ConnectedWindow } from "./ConnectedWindow";
import { WindowProps } from "./window/Window";
import { Doc } from "../../../convex/_generated/dataModel";
import { playSound } from "../../common/sounds/soundEffects";

export function ModalWindow({
  window,
  children,
  ...rest
}: {
  window: Doc<"windows">;
  children?: React.ReactNode;
} & Omit<
  WindowProps,
  | "title"
  | "viewState"
  | "isActive"
  | "x"
  | "y"
  | "width"
  | "height"
  | "onGeometryChange"
>) {
  useEffect(() => {
    playSound("balloon", 0.3);
  }, []);

  return createPortal(
    <>
      {/* Modal overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          pointerEvents: "auto",
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
      {/* Modal window */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <ConnectedWindow window={window} {...rest}>
            {children}
          </ConnectedWindow>
        </div>
      </div>
    </>,
    document.body,
  );
}
