import { CSSProperties, useMemo } from "react";
import type { DesktopFileDoc } from "./desktopFileIcon/DesktopFileIcon";
import {
  EXTENSION_ICON_MAP,
  MIME_ICON_MAP,
  DEFAULT_ICON,
} from "../../../shared/fileTypes";

type DesktopFileImageProps = {
  file: DesktopFileDoc;
  size?: number;
};

export function DesktopFileImage({ file, size = 48 }: DesktopFileImageProps) {
  const src = useMemo(() => {
    if (file.uploadState.kind === "uploaded") {
      try {
        const url = new URL(file.uploadState.url);
        const extension = url.pathname.split(".").pop()?.toLowerCase();
        if (extension && EXTENSION_ICON_MAP[extension]) {
          return EXTENSION_ICON_MAP[extension];
        }
      } catch (error) {
        console.warn("Failed to parse uploaded file URL", error);
      }
    }

    const nameExtension = file.name.split(".").pop()?.toLowerCase();
    if (nameExtension && EXTENSION_ICON_MAP[nameExtension]) {
      return EXTENSION_ICON_MAP[nameExtension];
    }

    if (file.type && MIME_ICON_MAP[file.type]) {
      return MIME_ICON_MAP[file.type];
    }

    return DEFAULT_ICON;
  }, [file]);

  const style: CSSProperties = useMemo(
    () => ({ width: `${size}px`, height: `${size}px`, objectFit: "contain" }),
    [size],
  );

  return <img src={src} alt={file.name} style={style} draggable={false} />;
}
