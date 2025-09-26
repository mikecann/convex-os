import { Fragment } from "react";
import { useTasks } from "../common/tasks/TasksContext";
import { ImagePreviewWindow } from "../apps/ImagePreviewWindow";

export function WindowingManager() {
  const { tasks, closeTask, focusTask, minimizeTask, activeTaskId } =
    useTasks();

  return (
    <Fragment>
      {tasks.map((task) => {
        if (task.kind === "image_preview" && !task.isMinimized) {
          const { id, file } = task;
          return (
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
            />
          );
        }
        return null;
      })}
    </Fragment>
  );
}
