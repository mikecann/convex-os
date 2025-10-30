import type { ReactNode } from "react";
import Box from "./Box";

interface CommonWindowShellProps {
  menubar: ReactNode;
  children: ReactNode;
}

export function CommonWindowShell({
  menubar,
  children,
}: CommonWindowShellProps) {
  return (
    <Box
      height="100%"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {menubar}
      <Box
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
