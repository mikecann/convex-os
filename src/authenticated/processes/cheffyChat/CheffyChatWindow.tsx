import { useRef } from "react";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { MessagesArea } from "./MessagesArea";
import { ResizableSidebarContainer } from "./ResizableSidebarContainer";
import { ChatInputArea } from "./ChatInputArea";
import { CheffyMenuBar } from "./CheffyMenuBar";
import { CommonWindowShell } from "../../../common/components/CommonWindowShell";
import { CheffyDropZone } from "./CheffyDropZone";
import { CheffyChatProvider } from "./CheffyChatContext";
import { Process } from "../../../../convex/processes/schema";
import { Doc } from "../../../../convex/_generated/dataModel";
import Box from "../../../common/components/Box";

export function CheffyChatWindow({
  process,
  window,
}: {
  process: Process<"cheffy_chat">;
  window: Doc<"windows">;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
      bodyStyle={{
        marginTop: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <CheffyChatProvider process={process}>
        <CommonWindowShell menubar={<CheffyMenuBar />}>
          <CheffyDropZone>
            <div
              ref={containerRef}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#f0f0f0",
                minHeight: 0,
                overflow: "hidden",
                width: "100%",
                height: "100%",
              }}
            >
              <ResizableSidebarContainer containerRef={containerRef} />
              <Box
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <MessagesArea />
                <ChatInputArea />
              </Box>
            </div>
          </CheffyDropZone>
        </CommonWindowShell>
      </CheffyChatProvider>
    </ConnectedWindow>
  );
}
