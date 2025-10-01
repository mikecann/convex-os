import { CSSProperties, useMemo } from "react";
import type { DesktopFileDoc } from "./DesktopFileIcon";

type DesktopFileImageProps = {
  file: DesktopFileDoc;
  size?: number;
};

const EXTENSION_ICON_MAP: Record<string, string> = {
  jpg: "/xp/image.png",
  jpeg: "/xp/image.png",
  png: "/xp/image.png",
  gif: "/xp/image.png",
  bmp: "/xp/image.png",
  svg: "/xp/image.png",
  webp: "/xp/image.png",
  mp3: "/xp/sound.png",
  wav: "/xp/sound.png",
  flac: "/xp/sound.png",
  mp4: "/xp/mediaplayer.png",
  mov: "/xp/mediaplayer.png",
  avi: "/xp/mediaplayer.png",
  mkv: "/xp/mediaplayer.png",
  pdf: "/xp/pdf.png",
  doc: "/xp/doc.png",
  docx: "/xp/doc.png",
  txt: "/xp/defaultprog.png",
  md: "/xp/defaultprog.png",
  json: "/xp/defaultprog.png",
  js: "/xp/defaultprog.png",
  ts: "/xp/defaultprog.png",
  html: "/xp/defaultprog.png",
  css: "/xp/defaultprog.png",
  zip: "/xp/recentdoc.png",
  rar: "/xp/recentdoc.png",
  "7z": "/xp/recentdoc.png",
  exe: "/xp/defaultprog.png",
  dmg: "/xp/defaultprog.png",
};

const MIME_ICON_MAP: Record<string, string> = {
  "image/png": "/xp/image.png",
  "image/jpeg": "/xp/image.png",
  "image/gif": "/xp/image.png",
  "application/pdf": "/xp/pdf.png",
  "audio/mpeg": "/xp/mediaplayer.png",
  "audio/wav": "/xp/sound.png",
  "video/mp4": "/xp/mediaplayer.png",
};

const DEFAULT_ICON = "/xp/doc.png";

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
