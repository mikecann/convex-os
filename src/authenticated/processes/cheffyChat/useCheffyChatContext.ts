import { useContext } from "react";
import { CheffyChatContext } from "./CheffyChatContextValue";

export function useCheffyChatContext() {
  const context = useContext(CheffyChatContext);
  if (!context)
    throw new Error(
      "useCheffyChatContext must be used within CheffyChatProvider",
    );
  return context;
}

