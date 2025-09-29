import { Fragment } from "react";
import { useTasks } from "../common/tasks/TasksContext";
import { ImagePreviewWindow } from "../apps/ImagePreviewWindow";
import { Window } from "../common/components/window/Window";

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
          const { id, file, isMinimized, title } = task;
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
              showCloseButton
              showMaximizeButton
              bodyStyle={{ padding: 0, maxWidth: "80vw", maxHeight: "80vh" }}
              style={{ minWidth: "320px", minHeight: "240px" }}
              resizable
            >
              <ImagePreviewWindow file={file} />
            </Window>
          );
        }
        return null;
      })}
    </Fragment>
  );
}
