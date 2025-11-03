import { DropZone } from "../../../common/dragDrop/DropZone";
import {
  createDataTypeFilter,
  getDragData,
} from "../../../common/dragDrop/helpers";
import { useCheffyChatContext } from "./useCheffyChatContext";
import { Id } from "../../../../convex/_generated/dataModel";
import type { ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function CheffyDropZone({ children }: { children: ReactNode }) {
  const { process } = useCheffyChatContext();
  const addAttachment = useMutation(api.my.cheffy.addAttachment);

  return (
    <DropZone
      dropMessage="Drop files here to attach"
      shouldAcceptDrag={createDataTypeFilter("application/x-desktop-file-id")}
      getDropEffect={() => "copy"}
      onDrop={async (event) => {
        const fileId = getDragData(
          event,
          "application/x-desktop-file-id",
        ) as Id<"files">;
        if (fileId)
          void addAttachment({
            processId: process._id,
            fileId,
          });
      }}
    >
      {children}
    </DropZone>
  );
}
