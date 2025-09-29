import { useEffect } from "react";
import { useTasks } from "../common/tasks/TasksSystem";

export default function UnauthenticatedContent() {
  const { openTask, closeTask } = useTasks();
  useEffect(() => {
    const task = openTask({ kind: "sign_in_sign_up" });
    return () => {
      closeTask(task.id);
    };
  }, [openTask, closeTask]);
  return null;
}
