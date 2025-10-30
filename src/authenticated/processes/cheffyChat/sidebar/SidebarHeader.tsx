import Flex from "../../../../common/components/Flex";
import Box from "../../../../common/components/Box";
import { Button } from "../../../../common/components/Button";

interface SidebarHeaderProps {
  title: string;
  onClose: () => void;
}

export function SidebarHeader({ title, onClose }: SidebarHeaderProps) {
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
      <Button onClick={onClose}>×</Button>
    </Flex>
  );
}

