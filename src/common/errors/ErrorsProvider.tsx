import { PropsWithChildren, useState } from "react";
import { ErrorsContext, ErrorsContextValue } from "./ErrorsContext";
import { Window } from "../components/window/Window";
import Vertical from "../components/Vertical";
import Horizontal from "../components/Horizontal";
import { Button } from "../components/Button";

type ErrorState = {
  message: string;
};

export default function ErrorsProvider({ children }: PropsWithChildren) {
  const [errorState, setErrorState] = useState<ErrorState | null>(null);

  const dismissError = () => {
    setErrorState(null);
  };

  const showError = (message: string) => {
    setErrorState({ message });
  };

  const value: ErrorsContextValue = {
    showError,
    dismissError,
  };

  return (
    <ErrorsContext.Provider value={value}>
      {children}
      {errorState ? (
        <Window
          title="Error"
          style={{
            width: "400px",
          }}
          showCloseButton={true}
          onClose={dismissError}
          isActive={true}
        >
          <Vertical gap={16} style={{ padding: "16px" }}>
            <Horizontal gap={16} align="start">
              {/* Error icon */}
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

              {/* Error message */}
              <div style={{ flex: 1, paddingTop: "4px", paddingLeft: "80px" }}>
                {errorState.message}
              </div>
            </Horizontal>

            {/* OK button */}
            <Horizontal justify="center" style={{ paddingTop: "8px" }}>
              <Button onClick={dismissError} style={{ minWidth: "75px" }}>
                OK
              </Button>
            </Horizontal>
          </Vertical>
        </Window>
      ) : null}
    </ErrorsContext.Provider>
  );
}
