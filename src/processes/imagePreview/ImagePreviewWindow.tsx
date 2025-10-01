import { useEffect, useMemo } from "react";
import { useWindow } from "../../common/components/window/WindowContext";
import { Process } from "../../../convex/processes/schema";
import { ConnectedWindow } from "../../windowing/ConnectedWindow";

type ImagePreviewTaskProps = {
  process: Process<"image_preview">;
};

export function ImagePreviewWindow({ process }: ImagePreviewTaskProps) {
  return <ConnectedWindow></ConnectedWindow>;

  // const {
  //   setTitle,
  //   setResizable,
  //   setShowMaximizeButton,
  //   setShowCloseButton,
  //   setBodyStyle,
  //   setStyle,
  // } = useWindow();

  // useEffect(() => {
  //   setTitle(file.name);
  // }, [file.name, setTitle]);

  // useEffect(() => {
  //   setResizable(true);
  //   setShowMaximizeButton(true);
  //   setShowCloseButton(true);
  //   setStyle({
  //     width: "640px",
  //     height: "480px",
  //     minWidth: "320px",
  //     minHeight: "240px",
  //   });
  // }, [
  //   setResizable,
  //   setShowMaximizeButton,
  //   setShowCloseButton,
  //   setBodyStyle,
  //   setStyle,
  // ]);

  // const imageUrl = useMemo(() => {
  //   if (file.uploadState.kind === "uploaded") return file.uploadState.url;
  //   return undefined;
  // }, [file]);

  // if (imageUrl)
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         backgroundColor: "#1a1a1a",
  //         width: "100%",
  //         height: "100%",
  //         padding: "12px",
  //         boxSizing: "border-box",
  //       }}
  //     >
  //       <img
  //         src={imageUrl}
  //         alt={file.name}
  //         style={{
  //           maxWidth: "100%",
  //           maxHeight: "100%",
  //           objectFit: "contain",
  //           borderRadius: "4px",
  //         }}
  //       />
  //     </div>
  //   );

  // return (
  //   <div
  //     style={{
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       width: "100%",
  //       height: "100%",
  //       padding: "16px",
  //       textAlign: "center",
  //     }}
  //   >
  //     <p style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
  //       Image preview is not available yet. Please wait for the upload to
  //       finish.
  //     </p>
  //   </div>
  // );
}
