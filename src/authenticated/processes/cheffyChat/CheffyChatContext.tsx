import { type ReactNode } from "react";
import { Process } from "../../../../convex/processes/schema";
import { CheffyChatContext } from "./CheffyChatContextValue";

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
