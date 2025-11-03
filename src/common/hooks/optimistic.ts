import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { optimisticallySendMessage } from "@convex-dev/agent/react";
import { Id } from "../../../convex/_generated/dataModel";

export function useOptimisticUpdatePosition() {
  return useMutation(api.my.files.updatePosition).withOptimisticUpdate(
    (localStore, { fileId, position }) => {
      const current = localStore.getQuery(api.my.files.list);
      if (current !== undefined) {
        const updated = current.map((f) =>
          f._id === fileId ? { ...f, position } : f,
        );
        localStore.setQuery(api.my.files.list, {}, updated);
      }
    },
  );
}

export function useOptimisticUpdatePositions() {
  return useMutation(api.my.files.updatePositions).withOptimisticUpdate(
    (localStore, { updates }) => {
      const current = localStore.getQuery(api.my.files.list);
      if (current !== undefined) {
        const updatesMap = new Map(
          updates.map(({ fileId, position }) => [fileId, position]),
        );
        const updated = current.map((f) => {
          const newPosition = updatesMap.get(f._id);
          return newPosition ? { ...f, position: newPosition } : f;
        });
        localStore.setQuery(api.my.files.list, {}, updated);
      }
    },
  );
}

export function useOptimisticSendMessage() {
  return useMutation(api.my.cheffy.sendMessage).withOptimisticUpdate(
    (localStore, { processId }) => {
      const processDoc = localStore.getQuery(api.my.processes.get, {
        processId,
      });
      if (!processDoc || processDoc.kind !== "cheffy_chat") return;
      if (!processDoc.props.threadId) return;

      const text = processDoc.props.input?.text?.trim();
      if (!text) return;

      optimisticallySendMessage(api.my.cheffy.listThreadMessages)(localStore, {
        threadId: processDoc.props.threadId,
        prompt: text,
      });

      localStore.setQuery(
        api.my.processes.get,
        { processId },
        {
          ...processDoc,
          props: {
            ...processDoc.props,
            input: {
              text: "",
              attachments: processDoc.props.input?.attachments ?? [],
            },
          },
        },
      );
    },
  );
}

export function useOptimisticFocusWindow() {
  return useMutation(api.my.windows.focus).withOptimisticUpdate(
    (localStore, { windowId }) => {
      // Find the window being focused in any windows list query
      const allWindows = localStore.getQuery(api.my.windows.list);
      let targetWindow = allWindows?.find((w) => w._id === windowId);
      let targetProcessId: Id<"processes"> | null = null;

      if (targetWindow) targetProcessId = targetWindow.processId;
      else {
        // If not found in the main list, check all process-specific lists
        const processes = localStore.getQuery(api.my.processes.list);
        if (processes)
          for (const process of processes) {
            const processWindows = localStore.getQuery(
              api.my.windows.listForProcess,
              { processId: process._id },
            );
            const found = processWindows?.find((w) => w._id === windowId);
            if (found) {
              targetWindow = found;
              targetProcessId = found.processId;
              break;
            }
          }
      }

      if (!targetWindow || !targetProcessId) return;

      // Get current active process
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );

      // Update activeProcessId to the new process
      localStore.setQuery(
        api.my.processes.activeProcessId,
        {},
        targetProcessId,
      );

      // Update windows for the target process - set focused window as active
      const targetProcessWindows = localStore.getQuery(
        api.my.windows.listForProcess,
        { processId: targetProcessId },
      );
      if (targetProcessWindows !== undefined) {
        const updated = targetProcessWindows.map((w) =>
          w._id === windowId
            ? {
                ...w,
                viewState:
                  w.viewState.kind === "open"
                    ? ({
                        ...w.viewState,
                        isActive: true,
                      } as const)
                    : ({
                        kind: "open" as const,
                        isActive: true,
                        viewStackOrder: 0,
                      } as const),
              }
            : w.viewState.kind === "open" && w.viewState.isActive
              ? {
                  ...w,
                  viewState: {
                    ...w.viewState,
                    isActive: false,
                  } as const,
                }
              : w,
        );
        localStore.setQuery(
          api.my.windows.listForProcess,
          { processId: targetProcessId },
          updated,
        );
      }

      // If there was a previously active process, deactivate its windows
      if (currentActiveProcessId && currentActiveProcessId !== targetProcessId) {
        const oldProcessWindows = localStore.getQuery(
          api.my.windows.listForProcess,
          { processId: currentActiveProcessId },
        );
        if (oldProcessWindows !== undefined) {
          const updated = oldProcessWindows.map((w) =>
            w.viewState.kind === "open" && w.viewState.isActive
              ? {
                  ...w,
                  viewState: {
                    ...w.viewState,
                    isActive: false,
                  } as const,
                }
              : w,
          );
          localStore.setQuery(
            api.my.windows.listForProcess,
            { processId: currentActiveProcessId },
            updated,
          );
        }
      }

      // Update the main windows list if it exists
      if (allWindows !== undefined) {
        const updated = allWindows.map((w) => {
          if (w._id === windowId) 
            return {
              ...w,
              viewState:
                w.viewState.kind === "open"
                  ? ({
                      ...w.viewState,
                      isActive: true,
                    } as const)
                  : ({
                      kind: "open" as const,
                      isActive: true,
                      viewStackOrder: 0,
                    } as const),
            };
          
          if (
            w.viewState.kind === "open" &&
            w.viewState.isActive &&
            w.processId !== targetProcessId
          ) 
            return {
              ...w,
              viewState: {
                ...w.viewState,
                isActive: false,
              } as const,
            };
          
          return w;
        });
        localStore.setQuery(api.my.windows.list, {}, updated);
      }
    },
  );
}

export function useOptimisticDeactivateActive() {
  return useMutation(api.my.windows.deactivateActive).withOptimisticUpdate(
    (localStore) => {
      // Get current active process
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );

      if (!currentActiveProcessId) return;

      // Set activeProcessId to null
      localStore.setQuery(api.my.processes.activeProcessId, {}, null);

      // Deactivate windows for the active process
      const activeProcessWindows = localStore.getQuery(
        api.my.windows.listForProcess,
        { processId: currentActiveProcessId },
      );
      if (activeProcessWindows !== undefined) {
        const updated = activeProcessWindows.map((w) =>
          w.viewState.kind === "open" && w.viewState.isActive
            ? {
                ...w,
                viewState: {
                  ...w.viewState,
                  isActive: false,
                } as const,
              }
            : w,
        );
        localStore.setQuery(
          api.my.windows.listForProcess,
          { processId: currentActiveProcessId },
          updated,
        );
      }

      // Update the main windows list if it exists
      const allWindows = localStore.getQuery(api.my.windows.list);
      if (allWindows !== undefined) {
        const updated = allWindows.map((w) =>
          w.viewState.kind === "open" &&
          w.viewState.isActive &&
          w.processId === currentActiveProcessId
            ? {
                ...w,
                viewState: {
                  ...w.viewState,
                  isActive: false,
                } as const,
              }
            : w,
        );
        localStore.setQuery(api.my.windows.list, {}, updated);
      }
    },
  );
}

export function useOptimisticFocusProcess() {
  return useMutation(api.my.processes.focus).withOptimisticUpdate(
    (localStore, { processId }) => {
      // Get current active process
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );

      // Update activeProcessId to the new process
      localStore.setQuery(api.my.processes.activeProcessId, {}, processId);

      // Get windows for the target process
      const targetProcessWindows = localStore.getQuery(
        api.my.windows.listForProcess,
        { processId },
      );
      if (targetProcessWindows !== undefined && targetProcessWindows.length > 0) {
        // Activate all windows for this process
        const updated = targetProcessWindows.map((w) => ({
          ...w,
          viewState:
            w.viewState.kind === "open"
              ? ({
                  ...w.viewState,
                  isActive: true,
                } as const)
              : ({
                  kind: "open" as const,
                  isActive: true,
                  viewStackOrder: 0,
                } as const),
        }));
        localStore.setQuery(
          api.my.windows.listForProcess,
          { processId },
          updated,
        );
      }

      // If there was a previously active process, deactivate its windows
      if (currentActiveProcessId && currentActiveProcessId !== processId) {
        const oldProcessWindows = localStore.getQuery(
          api.my.windows.listForProcess,
          { processId: currentActiveProcessId },
        );
        if (oldProcessWindows !== undefined) {
          const updated = oldProcessWindows.map((w) =>
            w.viewState.kind === "open" && w.viewState.isActive
              ? {
                  ...w,
                  viewState: {
                    ...w.viewState,
                    isActive: false,
                  } as const,
                }
              : w,
          );
          localStore.setQuery(
            api.my.windows.listForProcess,
            { processId: currentActiveProcessId },
            updated,
          );
        }
      }

      // Update the main windows list if it exists
      const allWindows = localStore.getQuery(api.my.windows.list);
      if (allWindows !== undefined) {
        const updated = allWindows.map((w) => {
          if (w.processId === processId) 
            return {
              ...w,
              viewState:
                w.viewState.kind === "open"
                  ? ({
                      ...w.viewState,
                      isActive: true,
                    } as const)
                  : ({
                      kind: "open" as const,
                      isActive: true,
                      viewStackOrder: 0,
                    } as const),
            };
          
          if (
            w.viewState.kind === "open" &&
            w.viewState.isActive &&
            w.processId !== processId
          ) 
            return {
              ...w,
              viewState: {
                ...w.viewState,
                isActive: false,
              } as const,
            };
          
          return w;
        });
        localStore.setQuery(api.my.windows.list, {}, updated);
      }
    },
  );
}
