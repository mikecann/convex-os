import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { optimisticallySendMessage } from "@convex-dev/agent/react";
import { Doc, Id } from "../../../convex/_generated/dataModel";

// ===== Helper Types =====

type Window = Doc<"windows">;

type WindowPredicate = (window: Window) => boolean;
type WindowTransform = (window: Window) => Window;

// Extract LocalStore type from the mutation context
type LocalStore = Parameters<
  Parameters<ReturnType<typeof useMutation>["withOptimisticUpdate"]>[0]
>[0];

// ===== Helper Functions =====

function findWindowInQueries(
  localStore: LocalStore,
  windowId: Id<"windows">,
): { window: Window; processId: Id<"processes"> } | null {
  const allWindows = localStore.getQuery(api.my.windows.list);
  const targetWindow = allWindows?.find((w: Window) => w._id === windowId);

  if (targetWindow)
    return { window: targetWindow, processId: targetWindow.processId };

  const processes = localStore.getQuery(api.my.processes.list);
  if (!processes) return null;

  for (const process of processes) {
    const processWindows = localStore.getQuery(api.my.windows.listForProcess, {
      processId: process._id,
    });
    const found = processWindows?.find((w: Window) => w._id === windowId);
    if (found) return { window: found, processId: found.processId };
  }

  return null;
}

function createActiveViewState(
  currentViewState: Window["viewState"],
  viewStackOrder = 9999,
): Window["viewState"] {
  if (currentViewState.kind === "open")
    return { ...currentViewState, isActive: true, viewStackOrder } as const;
  return { kind: "open" as const, isActive: true, viewStackOrder };
}

function createInactiveViewState(
  currentViewState: Window["viewState"],
): Window["viewState"] {
  if (currentViewState.kind === "open")
    return { ...currentViewState, isActive: false } as const;
  return currentViewState;
}

function createMinimizedViewState(): Window["viewState"] {
  return { kind: "minimized" } as const;
}

function updateWindowsInQuery<T extends Window>(
  windows: T[],
  predicate: WindowPredicate,
  transform: WindowTransform,
): T[] {
  return windows.map((w) => (predicate(w) ? (transform(w) as T) : w));
}

function updateProcessWindows(
  localStore: LocalStore,
  processId: Id<"processes">,
  transform: WindowTransform,
) {
  const processWindows = localStore.getQuery(api.my.windows.listForProcess, {
    processId,
  });
  if (processWindows === undefined) return;

  const updated = processWindows.map(transform);
  localStore.setQuery(api.my.windows.listForProcess, { processId }, updated);
}

function updateAllWindows(localStore: LocalStore, transform: WindowTransform) {
  const allWindows = localStore.getQuery(api.my.windows.list);
  if (allWindows === undefined) return;

  const updated = allWindows.map(transform);
  localStore.setQuery(api.my.windows.list, {}, updated);
}

function deactivateProcessWindows(
  localStore: LocalStore,
  processId: Id<"processes">,
) {
  updateProcessWindows(localStore, processId, (w) =>
    w.viewState.kind === "open" && w.viewState.isActive
      ? { ...w, viewState: createInactiveViewState(w.viewState) }
      : w,
  );

  updateAllWindows(localStore, (w) =>
    w.processId === processId &&
    w.viewState.kind === "open" &&
    w.viewState.isActive
      ? { ...w, viewState: createInactiveViewState(w.viewState) }
      : w,
  );
}

function activateProcessWindows(
  localStore: LocalStore,
  processId: Id<"processes">,
) {
  updateProcessWindows(localStore, processId, (w) => ({
    ...w,
    viewState: createActiveViewState(w.viewState),
  }));

  updateAllWindows(localStore, (w) =>
    w.processId === processId
      ? { ...w, viewState: createActiveViewState(w.viewState, 0) }
      : w.viewState.kind === "open" &&
          w.viewState.isActive &&
          w.processId !== processId
        ? { ...w, viewState: createInactiveViewState(w.viewState) }
        : w,
  );
}

// ===== Optimistic Update Hooks =====

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
      const result = findWindowInQueries(localStore, windowId);
      if (!result) return;

      const { processId: targetProcessId } = result;
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );

      localStore.setQuery(
        api.my.processes.activeProcessId,
        {},
        targetProcessId,
      );

      updateProcessWindows(localStore, targetProcessId, (w) =>
        w._id === windowId
          ? { ...w, viewState: createActiveViewState(w.viewState) }
          : w.viewState.kind === "open" && w.viewState.isActive
            ? {
                ...w,
                viewState: {
                  ...w.viewState,
                  isActive: false,
                  viewStackOrder: 9999,
                } as const,
              }
            : w,
      );

      if (currentActiveProcessId && currentActiveProcessId !== targetProcessId)
        deactivateProcessWindows(localStore, currentActiveProcessId);

      updateAllWindows(localStore, (w) =>
        w._id === windowId
          ? { ...w, viewState: createActiveViewState(w.viewState, 0) }
          : w.viewState.kind === "open" &&
              w.viewState.isActive &&
              w.processId !== targetProcessId
            ? { ...w, viewState: createInactiveViewState(w.viewState) }
            : w,
      );
    },
  );
}

export function useOptimisticDeactivateActive() {
  return useMutation(api.my.windows.deactivateActive).withOptimisticUpdate(
    (localStore) => {
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );
      if (!currentActiveProcessId) return;

      localStore.setQuery(api.my.processes.activeProcessId, {}, null);
      deactivateProcessWindows(localStore, currentActiveProcessId);
    },
  );
}

export function useOptimisticFocusProcess() {
  return useMutation(api.my.processes.focus).withOptimisticUpdate(
    (localStore, { processId }) => {
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );

      localStore.setQuery(api.my.processes.activeProcessId, {}, processId);
      activateProcessWindows(localStore, processId);

      if (currentActiveProcessId && currentActiveProcessId !== processId)
        deactivateProcessWindows(localStore, currentActiveProcessId);
    },
  );
}

export function useOptimisticMinimizeProcess() {
  return useMutation(api.my.processes.minimize).withOptimisticUpdate(
    (localStore, { processId }) => {
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );

      if (currentActiveProcessId === processId)
        localStore.setQuery(api.my.processes.activeProcessId, {}, null);

      updateProcessWindows(localStore, processId, (w) =>
        w.viewState.kind === "open" || w.viewState.kind === "maximized"
          ? { ...w, viewState: createMinimizedViewState() }
          : w,
      );

      updateAllWindows(localStore, (w) =>
        w.processId === processId &&
        (w.viewState.kind === "open" || w.viewState.kind === "maximized")
          ? { ...w, viewState: createMinimizedViewState() }
          : w,
      );
    },
  );
}

export function useOptimisticMinimizeWindow() {
  return useMutation(api.my.windows.minimize).withOptimisticUpdate(
    (localStore, { windowId }) => {
      const result = findWindowInQueries(localStore, windowId);
      if (!result) return;

      const { window: targetWindow, processId: targetProcessId } = result;

      if (
        targetWindow.viewState.kind !== "open" &&
        targetWindow.viewState.kind !== "maximized"
      )
        return;

      const wasActive =
        targetWindow.viewState.kind === "open" &&
        targetWindow.viewState.isActive;
      const currentActiveProcessId = localStore.getQuery(
        api.my.processes.activeProcessId,
      );

      if (wasActive && currentActiveProcessId === targetProcessId) {
        const processWindows = localStore.getQuery(
          api.my.windows.listForProcess,
          { processId: targetProcessId },
        );
        const hasOtherActiveWindow =
          processWindows?.some(
            (w) =>
              w._id !== windowId &&
              w.viewState.kind === "open" &&
              w.viewState.isActive,
          ) ?? false;

        if (!hasOtherActiveWindow)
          localStore.setQuery(api.my.processes.activeProcessId, {}, null);
      }

      updateProcessWindows(localStore, targetProcessId, (w) =>
        w._id === windowId &&
        (w.viewState.kind === "open" || w.viewState.kind === "maximized")
          ? { ...w, viewState: createMinimizedViewState() }
          : w,
      );

      updateAllWindows(localStore, (w) =>
        w._id === windowId &&
        (w.viewState.kind === "open" || w.viewState.kind === "maximized")
          ? { ...w, viewState: createMinimizedViewState() }
          : w,
      );
    },
  );
}
