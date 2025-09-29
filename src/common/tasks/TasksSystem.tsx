import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DesktopFileDoc } from "../../desktop/files/DesktopFileIcon";

type ImagePreviewTask = {
  id: string;
  kind: "image_preview";
  title: string;
  file: DesktopFileDoc;
  isMinimized: boolean;
};

type VideoPreviewTask = {
  id: string;
  kind: "video_preview";
  title: string;
  file: DesktopFileDoc;
  isMinimized: boolean;
};

export type Task = ImagePreviewTask | VideoPreviewTask;

type TasksSystemContextValue = {
  tasks: Array<Task>;
  activeTaskId: string | null;
  openImagePreview: (file: DesktopFileDoc) => void;
  openVideoPreview: (file: DesktopFileDoc) => void;
  closeTask: (taskId: string) => void;
  focusTask: (taskId: string) => void;
  syncFiles: (files: Array<DesktopFileDoc>) => void;
  minimizeTask: (taskId: string) => void;
  taskbarButtonRefs: { current: Map<string, HTMLElement | null> };
};

const TasksSystemContext = createContext<TasksSystemContextValue | undefined>(undefined);

export function TasksSystem({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const taskbarButtonRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  const openImagePreview = useCallback((file: DesktopFileDoc) => {
    let nextActiveId: string = file._id;
    setTasks((current) => {
      const existingIndex = current.findIndex(
        (task) => task.kind === "image_preview" && task.file._id === file._id,
      );

      if (existingIndex !== -1) {
        const updated = [...current];
        const existing = updated[existingIndex] as ImagePreviewTask;
        const refreshedTask: ImagePreviewTask = {
          ...existing,
          title: file.name,
          file,
          isMinimized: false,
        };
        updated.splice(existingIndex, 1);
        updated.push(refreshedTask);
        nextActiveId = refreshedTask.id;
        return updated;
      }

      const newTask: ImagePreviewTask = {
        id: file._id,
        kind: "image_preview",
        title: file.name,
        file,
        isMinimized: false,
      };
      nextActiveId = newTask.id;
      return [...current, newTask];
    });
    setActiveTaskId(nextActiveId);
  }, []);

  const openVideoPreview = useCallback((file: DesktopFileDoc) => {
    let nextActiveId: string = file._id;
    setTasks((current) => {
      const existingIndex = current.findIndex(
        (task) => task.kind === "video_preview" && task.file._id === file._id,
      );

      if (existingIndex !== -1) {
        const updated = [...current];
        const existing = updated[existingIndex] as VideoPreviewTask;
        const refreshedTask: VideoPreviewTask = {
          ...existing,
          title: file.name,
          file,
          isMinimized: false,
        };
        updated.splice(existingIndex, 1);
        updated.push(refreshedTask);
        nextActiveId = refreshedTask.id;
        return updated;
      }

      const newTask: VideoPreviewTask = {
        id: file._id,
        kind: "video_preview",
        title: file.name,
        file,
        isMinimized: false,
      };
      nextActiveId = newTask.id;
      return [...current, newTask];
    });
    setActiveTaskId(nextActiveId);
  }, []);

  const closeTask = useCallback((taskId: string) => {
    let nextActive: string | null = null;
    setTasks((current) => {
      const filtered = current.filter((task) => task.id !== taskId);
      if (filtered.length > 0) {
        nextActive = filtered[filtered.length - 1]!.id;
      }
      return filtered;
    });
    setActiveTaskId((currentActive) =>
      currentActive === taskId ? nextActive : currentActive,
    );
  }, []);

  const focusTask = useCallback((taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, isMinimized: false } : task,
      ),
    );
    setActiveTaskId(taskId);
  }, []);

  const minimizeTask = useCallback((taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, isMinimized: true } : task,
      ),
    );
    setActiveTaskId((currentActive) =>
      currentActive === taskId ? null : currentActive,
    );
  }, []);

  const syncFiles = useCallback(
    (files: Array<DesktopFileDoc>) => {
      const fileMap = new Map(files.map((file) => [file._id, file]));
      let changed = false;
      let computedActive = activeTaskId;

      setTasks((current) => {
        const nextTasks: Array<Task> = [];
        let localChanged = false;

        for (const task of current) {
          if (task.kind === "image_preview" || task.kind === "video_preview") {
            const updatedFile = fileMap.get(task.file._id);
            if (!updatedFile) {
              localChanged = true;
              if (task.id === computedActive) computedActive = null;
              continue;
            }

            if (updatedFile.name !== task.title || updatedFile !== task.file) {
              localChanged = true;
              nextTasks.push({
                ...task,
                title: updatedFile.name,
                file: updatedFile,
              });
              continue;
            }
          }
          nextTasks.push(task);
        }

        if (!localChanged) {
          return current;
        }

        changed = true;

        if (computedActive) {
          const stillExists = nextTasks.some(
            (task) => task.id === computedActive,
          );
          if (!stillExists) {
            computedActive =
              nextTasks.length > 0 ? nextTasks[nextTasks.length - 1]!.id : null;
          }
        }

        if (!computedActive && nextTasks.length > 0) {
          computedActive = nextTasks[nextTasks.length - 1]!.id;
        }

        return nextTasks;
      });

      if (changed) {
        setActiveTaskId(computedActive ?? null);
      }
    },
    [activeTaskId],
  );

  const value = useMemo<TasksSystemContextValue>(
    () => ({
      tasks,
      activeTaskId,
      openImagePreview,
      openVideoPreview,
      closeTask,
      focusTask,
      syncFiles,
      minimizeTask,
      taskbarButtonRefs,
    }),
    [
      tasks,
      activeTaskId,
      openImagePreview,
      openVideoPreview,
      closeTask,
      focusTask,
      syncFiles,
      minimizeTask,
    ],
  );

  return (
    <TasksSystemContext.Provider value={value}>{children}</TasksSystemContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksSystemContext);
  if (!context) throw new Error("useTasks must be used within a TasksProvider");
  return context;
}
