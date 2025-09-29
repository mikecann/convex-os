import React from "react";
import { Task, useTasks } from "../../common/tasks/TasksSystem";

const TASK_ICON_MAP: Record<Task["kind"], string> = {
  image_preview: "/xp/paint.png",
  video_preview: "/xp/mediaplayer.png",
  sign_in_sign_up: "/xp/users.png",
};

type TaskbarButtonProps = {
  task: Task;
};

export function TaskbarButton({ task }: TaskbarButtonProps) {
  const { activeTaskId, focusTask, minimizeTask, taskbarButtonRefs } =
    useTasks();
  const isActive = task.id === activeTaskId && !task.isMinimized;

  return (
    <button
      key={task.id}
      ref={(element) => {
        const refs = taskbarButtonRefs.current;
        if (element) {
          refs.set(task.id, element);
        } else {
          refs.delete(task.id);
        }
      }}
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
        gap: "6px",
        padding: "6px 12px",
        border: "1px solid rgba(0,0,0,0.4)",
        borderRadius: "4px",
        background: isActive
          ? "linear-gradient(0deg, #0a5bc6 0%, #1198e9 100%)"
          : "linear-gradient(0deg, #1943b8 0%, #3370d3 100%)",
        color: "white",
        boxShadow: isActive
          ? "inset 1px 1px 1px rgba(255,255,255,0.4)"
          : "1px 1px 2px rgba(0,0,0,0.4)",
        cursor: "pointer",
        minWidth: "120px",
        outline: "none",
      }}
    >
      <img
        src={TASK_ICON_MAP[task.kind]}
        alt=""
        style={{ width: "16px", height: "16px" }}
      />
      {task.title}
    </button>
  );
}
