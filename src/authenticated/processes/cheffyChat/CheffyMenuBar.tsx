import { MenuBar } from "../../../common/components/MenuBar";
import { useCheffyChatContext } from "./CheffyChatContext";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function CheffyMenuBar() {
  const { process } = useCheffyChatContext();
  const toggleSidebar = useMutation(api.my.cheffy.toggleSidebar);
  const createThread = useMutation(api.my.cheffy.createThread);

  return (
    <MenuBar
      items={[
        {
          label: "File",
          items: [
            {
              label: "New Thread",
              onClick: () => {
                void createThread({ processId: process._id });
              },
            },
          ],
        },
        {
          label: "View",
          items: [
            {
              label: "Threads",
              onClick: () => {
                void toggleSidebar({ processId: process._id });
              },
            },
          ],
        },
      ]}
    />
  );
}
