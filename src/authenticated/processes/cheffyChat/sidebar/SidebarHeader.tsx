import Flex from "../../../../common/components/Flex";
import Box from "../../../../common/components/Box";
import { Button } from "../../../../common/components/Button";
import { useCheffyChatContext } from "../useCheffyChatContext";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface SidebarHeaderProps {
  title: string;
}

export function SidebarHeader({ title }: SidebarHeaderProps) {
  const { process } = useCheffyChatContext();
  const toggleSidebar = useMutation(api.my.cheffy.toggleSidebar);

  return (
    <Flex
      padding="8px"
      justify="space-between"
      align="center"
      style={{ backgroundColor: "#f0f0f0", borderBottom: "1px solid #919B9C" }}
    >
      <Box
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          fontFamily: "Tahoma, sans-serif",
        }}
      >
        {title}
      </Box>
      <Button
        onClick={() => {
          void toggleSidebar({ processId: process._id });
        }}
      >
        ×
      </Button>
    </Flex>
  );
}

