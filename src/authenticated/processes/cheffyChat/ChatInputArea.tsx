import { AttachmentsArea } from "./AttachmentsArea";
import { ChatWindowInputBox } from "./ChatWindowInputBox";
import { useCheffyChatContext } from "./CheffyChatContext";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebouncedServerSync } from "../../../common/hooks/useDebouncedServerSync";

export function ChatInputArea() {
  const { process } = useCheffyChatContext();


  const updateText = useMutation(api.my.cheffy.updateText);




  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: "#ece9d8",
      }}
    >
      <AttachmentsArea />
      <ChatWindowInputBox

  
      />
    </div>
  );
}
