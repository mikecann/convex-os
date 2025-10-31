import { type RefObject } from "react";
import Vertical from "../../../../common/components/Vertical";
import Box from "../../../../common/components/Box";
import { SidebarHeader } from "./SidebarHeader";
import { ThreadsList } from "./ThreadsList";
import { useCheffyChatContext } from "../CheffyChatContext";

interface ThreadsSidebarProps {
  width: number;
  sidebarRef?: RefObject<HTMLDivElement | null>;
}

export function ThreadsSidebar({ width, sidebarRef }: ThreadsSidebarProps) {


  return (
    <Vertical
      ref={sidebarRef}
      width={`${width}px`}
      background="#ECE9D8"
      style={{
        flexShrink: 0,
        borderRight: "1px solid #919b9c9a",
        minHeight: 0,
      }}
    >
      <SidebarHeader title="Threads" />
      <Box
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px",
        }}
      >
        <ThreadsList
        />
      </Box>
    </Vertical>
  );
}
