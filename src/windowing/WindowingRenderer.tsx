import { Fragment, useMemo } from "react";
import { Task, useTasks } from "../common/tasks/TasksSystem";
import { ImagePreviewTask } from "../tasks/ImagePreviewTask";
import { Window } from "../common/components/window/Window";
import { VideoPreviewTask } from "../tasks/VideoPreviewTask";
import { SignInSignUpTask } from "../tasks/SignInSignUpTask";
import { exhaustiveCheck, iife } from "../../shared/misc";

export function WindowingRenderer() {
  const {
    tasks,
    closeTask,
    focusTask,
    minimizeTask,
    activeTaskId,
    taskbarButtonRefs,
  } = useTasks();

  const sortedTasks = useMemo(() => {
    const activeTask = tasks.find((task) => task.id === activeTaskId);
    if (!activeTask) return tasks;
    return [...tasks.filter((task) => task.id !== activeTaskId), activeTask];
  }, [tasks, activeTaskId]);

  return (
    <>
      {sortedTasks.map((task) => {
        const { id, isMinimized, title } = task;

        return (
          <Window
            key={id}
            title={title}
            onClose={() => closeTask(id)}
            onFocus={() => focusTask(id)}
            onMinimize={() => minimizeTask(id)}
            isActive={activeTaskId === id}
            isMinimized={isMinimized}
            taskbarButtonRect={taskbarButtonRefs.current
              .get(id)
              ?.getBoundingClientRect()}
          >
            {iife(() => {
              if (task.kind === "image_preview")
                return <ImagePreviewTask file={task.file} />;

              if (task.kind === "video_preview")
                return <VideoPreviewTask file={task.file} />;

              if (task.kind == "sign_in_sign_up") return <SignInSignUpTask />;

              exhaustiveCheck(task);
            })}
          </Window>
        );
      })}
    </>
  );
}
