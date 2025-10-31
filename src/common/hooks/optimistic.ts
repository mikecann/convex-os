import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { optimisticallySendMessage } from "@convex-dev/agent/react";

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
