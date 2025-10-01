import { useContext } from "react";
import { ErrorsContext } from "./ErrorsProvider";
import { LocalWindow } from "../../os/windowing/LocalWindow";
import { Button } from "../components/Button";
import Vertical from "../components/Vertical";
import Horizontal from "../components/Horizontal";

export function ErrorsRenderer() {
  const context = useContext(ErrorsContext);
  if (!context?.error) return null;

  return (
    <LocalWindow
      title="Error"
      showCloseButton={true}
      viewState={{ kind: "open", viewStackOrder: 99999, isActive: true }}
      x={0}
      y={0}
      width={350}
      height={200}
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
