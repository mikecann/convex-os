import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DesktopFileDoc } from "../../authenticated/files/desktopFileIcon/DesktopFileIcon";

type TaskBase = {
  id: string;
  title: string;
  isMinimized: boolean;
};

type ImagePreviewTask = TaskBase & {
  kind: "image_preview";
  file: DesktopFileDoc;
};

type VideoPreviewTask = TaskBase & {
  kind: "video_preview";
  file: DesktopFileDoc;
};

type SignInSignUpTask = TaskBase & {
  kind: "sign_in_sign_up";
};

export type Task = ImagePreviewTask | VideoPreviewTask | SignInSignUpTask;

export type TaskDef =
  | Omit<ImagePreviewTask, "id" | "title" | "isMinimized">
  | Omit<VideoPreviewTask, "id" | "title" | "isMinimized">
  | Omit<SignInSignUpTask, "id" | "title" | "isMinimized">;

type TasksSystemContextValue = {
  tasks: Array<Task>;
  activeTaskId: string | null;
  openTask: (taskDef: TaskDef) => Task;
  closeTask: (taskId: string) => void;
  focusTask: (taskId: string) => void;
  syncFiles: (files: Array<DesktopFileDoc>) => void;
  minimizeTask: (taskId: string) => void;
  taskbarButtonRefs: { current: Map<string, HTMLElement | null> };
};

const TasksSystemContext = createContext<TasksSystemContextValue | undefined>(
  undefined,
);

export function TasksSystem({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const taskbarButtonRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  const openTask = useCallback((taskDef: TaskDef): Task => {
    if (taskDef.kind === "image_preview" || taskDef.kind === "video_preview") {
      const task: Task = {
        id: taskDef.file._id,
        ...taskDef,
        title: taskDef.file.name,
        isMinimized: false,
      };

      setTasks((current) => {
        const existingIndex = current.findIndex((t) => t.id === task.id);

        if (existingIndex !== -1) {
          const updated = [...current];
          const existing = updated[existingIndex];
          if (!existing) return [...current, task];
          const refreshedTask: Task = {
            ...existing,
            ...task,
            isMinimized: false,
          };
          updated.splice(existingIndex, 1);
          updated.push(refreshedTask);
          return updated;
        }

        return [...current, task];
      });

      setActiveTaskId(task.id);
      return task;
    }

    if (taskDef.kind === "sign_in_sign_up") {
      const task: Task = {
        id: "sign_in_sign_up",
        kind: "sign_in_sign_up",
        title: "Sign In",
        isMinimized: false,
      };

      setTasks((current) => {
        const existingIndex = current.findIndex((t) => t.id === task.id);

        if (existingIndex !== -1) {
          const updated = [...current];
          const existing = updated[existingIndex];
          if (!existing) return [...current, task];
          const refreshedTask: Task = {
            ...existing,
            ...task,
            isMinimized: false,
          };
          updated.splice(existingIndex, 1);
          updated.push(refreshedTask);
          return updated;
        }

        return [...current, task];
      });

      setActiveTaskId(task.id);
      return task;
    }

    throw new Error(`Unknown task kind: ${taskDef satisfies never}`);
  }, []);

  const closeTask = useCallback((taskId: string) => {
    let nextActive: string | null = null;
    setTasks((current) => {
      const filtered = current.filter((task) => task.id !== taskId);
      if (filtered.length > 0) {
        const lastTask = filtered[filtered.length - 1];
        if (lastTask) nextActive = lastTask.id;
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

        if (!localChanged) return current;

        changed = true;

        if (computedActive) {
          const stillExists = nextTasks.some(
            (task) => task.id === computedActive,
          );
          if (!stillExists) {
            const lastTask = nextTasks[nextTasks.length - 1];
            computedActive = lastTask ? lastTask.id : null;
          }
        }

        if (!computedActive && nextTasks.length > 0) {
          const lastTask = nextTasks[nextTasks.length - 1];
          if (lastTask) computedActive = lastTask.id;
        }

        return nextTasks;
      });

      if (changed) setActiveTaskId(computedActive ?? null);
    },
    [activeTaskId],
  );

  const value = useMemo<TasksSystemContextValue>(
    () => ({
      tasks,
      activeTaskId,
      openTask,
      closeTask,
      focusTask,
      syncFiles,
      minimizeTask,
      taskbarButtonRefs,
    }),
    [
      tasks,
      activeTaskId,
      openTask,
      closeTask,
      focusTask,
      syncFiles,
      minimizeTask,
    ],
  );

  return (
    <TasksSystemContext.Provider value={value}>
      {children}
    </TasksSystemContext.Provider>
  );
}

// export function useTasks() {
//   const context = useContext(TasksSystemContext);
//   if (!context) throw new Error("useTasks must be used within a TasksProvider");
//   return context;
// }
