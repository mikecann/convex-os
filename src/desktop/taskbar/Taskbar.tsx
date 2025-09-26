import React from "react";
import { StartButton } from "./StartButton";
import { Clock } from "./Clock";
import { useTasks } from "../../common/tasks/TasksContext";

interface TaskbarProps {
  onStartClick?: () => void;
}

export function Taskbar({ onStartClick }: TaskbarProps) {
  const { tasks, activeTaskId, focusTask, minimizeTask } = useTasks();

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
      }}
    >
      {/* Start button */}
      <StartButton onClick={onStartClick} />

      {/* System tray */}
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
        {tasks.map((task) => {
          const isActive = task.id === activeTaskId && !task.isMinimized;
          return (
            <button
              key={task.id}
              onClick={() => {
                if (isActive) {
                  minimizeTask(task.id);
                  return;
                }
                focusTask(task.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 12px",
                border: "1px solid rgba(0,0,0,0.4)",
                borderRadius: "4px",
                background: isActive
                  ? "linear-gradient(0deg, #1d4ed8 0%, #3b82f6 100%)"
                  : "linear-gradient(0deg, #0a5bc6 0%, #1198e9 100%)",
                color: "white",
                boxShadow: isActive
                  ? "inset 1px 1px 1px rgba(255,255,255,0.4)"
                  : "1px 1px 2px rgba(0,0,0,0.4)",
                cursor: "pointer",
                minWidth: "120px",
              }}
            >
              {task.title}
            </button>
          );
        })}
      </div>
      <div
        style={{
          marginLeft: "auto",
          height: "100%",
          width: "fit-content",
          color: "white",
          borderTop: "1px solid #075dca",
          borderBottom: "1px solid #0a5bc6",
          borderRight: "1px solid transparent",
          borderLeft: "1px solid black",
          backgroundImage:
            "linear-gradient(0deg, #0a5bc6 0%, #1198e9 6%, #1198e9 51%, #1198e9 63%, #1198e9 77%, #19b9f3 95%, #075dca 97%)",
          boxShadow: "2px 0px 3px #20e2fc inset",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "1px",
          fontSize: "14px",
          gap: "4px",
        }}
      >
        <Clock />
      </div>
    </div>
  );
}
