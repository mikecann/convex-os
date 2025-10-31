import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

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
