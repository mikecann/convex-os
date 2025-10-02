import { Process } from "../../../../convex/processes/schema";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";

export function CheffyChatWindow({
  process,
  window,
}: {
  process: Process<"cheffy_chat">;
  window: Doc<"windows">;
}) {
  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <p style={{ color: "#666", fontSize: "16px" }}>
          Cheffy Chat - Coming Soon
        </p>
      </div>
    </ConnectedWindow>
  );
}
