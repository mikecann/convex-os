import { DropZone } from "../../../common/dragDrop/DropZone";
import {
  createDataTypeFilter,
  getDragData,
} from "../../../common/dragDrop/helpers";
import { useCheffyChatContext } from "./CheffyChatContext";
import { Id } from "../../../../convex/_generated/dataModel";
import type { ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function CheffyDropZone({ children }: { children: ReactNode }) {
  const addAttachment = useMutation(api.cheffy.chat.addAttachment);

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
        if (fileId) {
          const newAttachments = [...attachments];
          if (!newAttachments.includes(fileId)) {
            newAttachments.push(fileId);
            void updateProcessProps({
              processId: process._id,
              props: {
                threadId: process.props.threadId,
                sidebar: process.props.sidebar,
                input: {
                  text: inputText,
                  attachments: newAttachments,
                },
              },
            });
          }
        }
      }}
    >
      {children}
    </DropZone>
  );
}

