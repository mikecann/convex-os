import { MenuBar } from "../../../common/components/MenuBar";
import { useCheffyChatContext } from "./CheffyChatContext";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function CheffyMenuBar() {
  const { process } = useCheffyChatContext();
  const toggleSidebar = useMutation(api.my.cheffy.toggleSidebar);

  return (
    <MenuBar
      items={[
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
