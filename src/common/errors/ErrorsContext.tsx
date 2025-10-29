import { createContext } from "react";

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
