import { useContext, useEffect } from "react";
import { ErrorsContext } from "./ErrorsProvider";
import { LocalWindow } from "../../os/windowing/LocalWindow";
import { Button } from "../components/Button";
import Vertical from "../components/Vertical";
import Horizontal from "../components/Horizontal";
import { playSound } from "../sounds/soundEffects";

export function ErrorsRenderer() {
  const context = useContext(ErrorsContext);

  useEffect(() => {
    if (context?.error) 
      playSound("criticalStop", 0.4);
    
  }, [context?.error]);

  if (!context?.error) return null;

  return (
    <LocalWindow
      title="Error"
      icon="/xp/dialog/error.png"
      showCloseButton={true}
      viewState={{ kind: "open", viewStackOrder: 99999, isActive: true }}
      width={350}
      height={160}
      onClose={context.dismissError}
    >
      <Vertical gap={16} style={{ padding: "16px" }}>
        <Horizontal gap={16} align="start">
          <img
            src="/error-cross.png"
            alt="Error"
            style={{
              position: "absolute",
              top: "40px",
              left: "20px",
              width: "64px",
              height: "64px",
              flexShrink: 0,
            }}
          />

          <div style={{ flex: 1, paddingTop: "4px", paddingLeft: "80px" }}>
            {context.error.message}
          </div>
        </Horizontal>

        <Horizontal justify="center" style={{ paddingTop: "8px" }}>
          <Button onClick={context.dismissError} style={{ minWidth: "75px" }}>
            OK
          </Button>
        </Horizontal>
      </Vertical>
    </LocalWindow>
  );
}
