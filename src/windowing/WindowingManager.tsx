import { Fragment } from "react";
import { useTasks } from "../common/tasks/TasksContext";
import { ImagePreviewWindow } from "../apps/ImagePreviewWindow";
import { Window } from "../common/components/window/Window";
import { VideoPreviewWindow } from "../apps/VideoPreviewWindow";

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
        const windowProps = {
          key: id,
          title,
          onClose: () => closeTask(id),
          onFocus: () => focusTask(id),
          onMinimize: () => minimizeTask(id),
          isActive: activeTaskId === id,
          isMinimized,
          taskbarButtonRect: taskbarButtonRefs.current
            .get(id)
            ?.getBoundingClientRect(),
          showCloseButton: true,
          showMaximizeButton: true,
          bodyStyle: { padding: 0, maxWidth: "80vw", maxHeight: "80vh" },
          style: { minWidth: "320px", minHeight: "240px" },
          resizable: true,
        };
        if (task.kind === "image_preview") {
          return (
            <Window {...windowProps}>
              <ImagePreviewWindow file={task.file} />
            </Window>
          );
        }
        if (task.kind === "video_preview") {
          return (
            <Window {...windowProps}>
              <VideoPreviewWindow file={task.file} />
            </Window>
          );
        }
        return null;
      })}
    </Fragment>
  );
}
