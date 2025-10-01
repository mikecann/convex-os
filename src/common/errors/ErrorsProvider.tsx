import { createContext, PropsWithChildren, useState } from "react";

type ErrorState = {
  message: string;
};

export type ErrorsContextValue = {
  error: ErrorState | null;
  showError: (message: string) => void;
  dismissError: () => void;
};

export const ErrorsContext = createContext<ErrorsContextValue | undefined>(
  undefined,
);

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
