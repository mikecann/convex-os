import React from "react";
import { StartButton } from "./StartButton";
import { TaskbarButton } from "./TaskbarButton";
import { SystemTray } from "./SystemTray";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Box from "../../common/components/Box";

interface TaskbarProps {
  onStartClick?: () => void;
}

export function Taskbar({ onStartClick }: TaskbarProps) {
  const processes = useQuery(api.my.processes.list) ?? [];
  const activeProcessId = useQuery(api.my.processes.activeProcessId);
  return (
    <Box
      className="taskbar"
      style={{
        width: "100%",
        height: "38px",
        backgroundImage:
          "linear-gradient(0deg, #042b8e 0%, #0551f6 6%, #0453ff 51%, #0551f6 63%, #0551f6 81%, #3a8be8 99%, #0453ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        userSelect: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
      }}
    >
      <StartButton onClick={onStartClick} />
      <Box
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          paddingLeft: "8px",
          paddingRight: "8px",
          overflow: "hidden",
        }}
      >
        {processes.map((process) => (
          <TaskbarButton
            key={process._id}
            process={process}
            isActive={process._id === activeProcessId}
          />
        ))}
      </Box>
      <SystemTray />
    </Box>
  );
}
