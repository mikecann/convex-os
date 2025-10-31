import { createContext, useContext, useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { api } from "../../../../convex/_generated/api";
import { useDebouncedServerSync } from "../../../common/hooks/useDebouncedServerSync";

interface CheffyChatContextValue {
  process: Process<"cheffy_chat">;
}

const CheffyChatContext = createContext<CheffyChatContextValue | null>(null);

export function useCheffyChatContext() {
  const context = useContext(CheffyChatContext);
  if (!context)
    throw new Error(
      "useCheffyChatContext must be used within CheffyChatProvider",
    );
  return context;
}

interface CheffyChatProviderProps {
  process: Process<"cheffy_chat">;
  children: ReactNode;
}

export function CheffyChatProvider({
  process,
  children,
}: CheffyChatProviderProps) {
  return (
    <CheffyChatContext.Provider
      value={{
        process,
      }}
    >
      {children}
    </CheffyChatContext.Provider>
  );
}
