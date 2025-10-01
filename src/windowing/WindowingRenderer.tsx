import { Fragment, useMemo } from "react";
import { Window } from "../common/components/window/Window";
import { SignInSignUpWindow } from "../auth/SignInSignUpWindow";
import { exhaustiveCheck, iife } from "../../shared/misc";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useOS } from "../os/OperatingSystem";
import { ConnectedWindow } from "./ConnectedWindow";

export function WindowingRenderer() {
  // const {
  //   tasks,
  //   closeTask,
  //   focusTask,
  //   minimizeTask,
  //   activeTaskId,
  //   taskbarButtonRefs,
  // } = useTasks();

  // const sortedTasks = useMemo(() => {
  //   const activeTask = tasks.find((task) => task.id === activeTaskId);
  //   if (!activeTask) return tasks;
  //   return [...tasks.filter((task) => task.id !== activeTaskId), activeTask];
  // }, [tasks, activeTaskId]);

  const windows = useQuery(api.my.windows.list);

  return (
    <>
      {windows?.map((window) => {
        return <ConnectedWindow key={window._id} window={window} />;
      })}
    </>
  );
}
