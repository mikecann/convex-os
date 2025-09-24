import { createContext } from "react";

export type ErrorsContextValue = {
  showError: (message: string) => void;
  dismissError: () => void;
};

export const ErrorsContext = createContext<ErrorsContextValue | undefined>(
  undefined,
);
