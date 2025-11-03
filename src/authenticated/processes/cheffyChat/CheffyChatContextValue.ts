import { createContext } from "react";
import { Process } from "../../../../convex/processes/schema";

interface CheffyChatContextValue {
  process: Process<"cheffy_chat">;
}

export const CheffyChatContext = createContext<CheffyChatContextValue | null>(
  null,
);

