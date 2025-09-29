import { Fragment } from "react";
import { useTasks } from "../common/tasks/TasksContext";
import { ImagePreviewTask } from "../tasks/ImagePreviewTask";
import { Window } from "../common/components/window/Window";
import { VideoPreviewTask } from "../tasks/VideoPreviewTask";
import { exhaustiveCheck, iife } from "../../shared/misc";

export function WindowingManager() {
  const {
    tasks,
    closeTask,
    focusTask,
    minimizeTask,
    activeTaskId,
    taskbarButtonRefs,
  } = useTasks();

  return (
    <Fragment>
      {tasks.map((task) => {
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

              exhaustiveCheck(task);
            })}
          </Window>
        );
      })}
    </Fragment>
  );
}
