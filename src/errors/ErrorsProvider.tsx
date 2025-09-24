import { PropsWithChildren, useState } from "react";
import { Button, Window } from "react-windows-xp";
import { Box, Horizontal } from "../common/components";
import { ErrorsContext, ErrorsContextValue } from "./ErrorsContext";

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
            position: "fixed",
            top: "20px",
            right: "20px",
            width: "320px",
          }}
        >
          <Box style={{ padding: "12px" }}>
            {/* <Error
              message={errorState.message}
              onClose={() => dismissError()}
            /> */}
          </Box>
        </Window>
      ) : null}
    </ErrorsContext.Provider>
  );
}
