import React from "react";
import { StartButton } from "./StartButton";
import { useTasks } from "../../common/tasks/TasksSystem";
import { TaskbarButton } from "./TaskbarButton";
import { SystemTray } from "./SystemTray";

interface TaskbarProps {
  onStartClick?: () => void;
}

export function Taskbar({ onStartClick }: TaskbarProps) {
  const { tasks } = useTasks();

  return (
    <div
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
        zIndex: 1000,
      }}
    >
      <StartButton onClick={onStartClick} />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        {tasks.map((task) => (
          <TaskbarButton key={task.id} task={task} />
        ))}
      </div>
      <SystemTray />
    </div>
  );
}
