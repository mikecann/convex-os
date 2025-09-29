import { Fragment } from "react";
import { useTasks } from "../common/tasks/TasksContext";
import { ImagePreviewWindow } from "../apps/ImagePreviewWindow";

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
        if (task.kind === "image_preview") {
          const { id, file, isMinimized } = task;
          return (
            // Renders a window for an image preview task.
            <ImagePreviewWindow
              key={id}
              file={file}
              onClose={() => {
                closeTask(id);
              }}
              onFocus={() => {
                focusTask(id);
              }}
              onMinimize={() => {
                minimizeTask(id);
              }}
              isActive={activeTaskId === id}
              isMinimized={isMinimized}
              taskbarButtonRect={taskbarButtonRefs.current
                .get(id)
                ?.getBoundingClientRect()}
            />
          );
        }
        return null;
      })}
    </Fragment>
  );
}
