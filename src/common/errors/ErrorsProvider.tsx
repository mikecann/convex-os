import { PropsWithChildren, useState } from "react";
import { ErrorsContext } from "./ErrorsContext";

type ErrorState = {
  message: string;
};

export default function ErrorsProvider({ children }: PropsWithChildren) {
  const [error, setError] = useState<ErrorState | null>(null);

  return (
    <ErrorsContext.Provider
      value={{
        error,
        showError: (message) => {
          setError({ message });
        },
        dismissError: () => {
          setError(null);
        },
      }}
    >
      {children}
    </ErrorsContext.Provider>
  );
}
