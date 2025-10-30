import { AttachmentsArea } from "./AttachmentsArea";
import { ChatWindowInputBox } from "./ChatWindowInputBox";
import { useCheffyChatContext } from "./CheffyChatContext";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebouncedServerSync } from "../../../common/hooks/useDebouncedServerSync";

export function ChatInputArea() {
  const { process, setIsLoading } = useCheffyChatContext();
  const sendMessageAction = useAction(api.cheffy.chat.sendMessage);

  const updateText = useMutation(api.my.cheffy.updateText);

  const attachments = process.props.input?.attachments ?? [];

  const [inputText, setInputText] = useDebouncedServerSync(
    process.props.input?.text ?? "",
    (text) => {
      void updateText({
        processId: process._id,
        text,
      });
    },
  );

  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: "#ece9d8",
      }}
    >
      <AttachmentsArea />
      <ChatWindowInputBox
        message={inputText}
        onMessageChange={setInputText}
        onSend={async (message: string) => {
          if (!message.trim() && process.props.input?.attachments?.length === 0)
            return;

          setIsLoading(true);

          sendMessageAction({
            processId: process._id,
          })
            .then(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              console.error("Failed to send message:", err);
              setIsLoading(false);
            });
        }}
      />
    </div>
  );
}
