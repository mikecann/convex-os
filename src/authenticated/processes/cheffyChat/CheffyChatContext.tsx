import { createContext, useContext, useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { api } from "../../../../convex/_generated/api";
import { useDebouncedServerSync } from "../../../common/hooks/useDebouncedServerSync";

interface CheffyChatContextValue {
  process: Process<"cheffy_chat">;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
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
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CheffyChatContext.Provider
      value={{
        process,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CheffyChatContext.Provider>
  );
}
