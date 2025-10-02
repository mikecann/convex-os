import { ProcessKinds } from "../../../convex/processes/schema";
import { Id } from "../../../convex/_generated/dataModel";

interface ProcessConfig {
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}

const processConfigs: Record<ProcessKinds, ProcessConfig> = {
  image_preview: {
    title: "Image Preview",
    icon: "/xp/image.png",
    defaultWidth: 600,
    defaultHeight: 400,
  },
  video_player: {
    title: "Video Player",
    icon: "/xp/mediaplayer.png",
    defaultWidth: 600,
    defaultHeight: 400,
  },
  text_preview: {
    title: "Text Preview",
    icon: "/xp/doc.png",
    defaultWidth: 600,
    defaultHeight: 600,
  },
  cheffy_chat: {
    title: "Cheffy Chat",
    icon: "/cheffy.webp",
    defaultWidth: 400,
    defaultHeight: 600,
  },
} as const;

export function startImagePreview(options?: {
  x?: number;
  y?: number;
  fileId?: Id<"files">;
  fileName?: string;
}) {
  const config = processConfigs.image_preview;
  const title = options?.fileName
    ? `${options.fileName} - ${config.title}`
    : config.title;

  return {
    kind: "image_preview" as const,
    props: options?.fileId ? { fileId: options.fileId } : {},
    windowCreationParams: {
      x: options?.x ?? 100,
      y: options?.y ?? 100,
      width: config.defaultWidth,
      height: config.defaultHeight,
      title,
      icon: config.icon,
    },
  };
}

export function startVideoPlayer(options?: {
  x?: number;
  y?: number;
  fileId?: Id<"files">;
  fileName?: string;
}) {
  const config = processConfigs.video_player;
  const title = options?.fileName
    ? `${options.fileName} - ${config.title}`
    : config.title;

  return {
    kind: "video_player" as const,
    props: options?.fileId ? { fileId: options.fileId } : {},
    windowCreationParams: {
      x: options?.x ?? 100,
      y: options?.y ?? 100,
      width: config.defaultWidth,
      height: config.defaultHeight,
      title,
      icon: config.icon,
    },
  };
}

export function startTextPreview(options?: {
  x?: number;
  y?: number;
  fileId?: Id<"files">;
  fileName?: string;
}) {
  const config = processConfigs.text_preview;
  const title = options?.fileName
    ? `${options.fileName} - ${config.title}`
    : config.title;

  return {
    kind: "text_preview" as const,
    props: options?.fileId ? { fileId: options.fileId } : {},
    windowCreationParams: {
      x: options?.x ?? 100,
      y: options?.y ?? 100,
      width: config.defaultWidth,
      height: config.defaultHeight,
      title,
      icon: config.icon,
    },
  };
}

export function startCheffyChat(options?: {
  x?: number;
  y?: number;
  input?: {
    text: string;
    attachments: Array<Id<"files">>;
  };
}) {
  const config = processConfigs.cheffy_chat;

  return {
    kind: "cheffy_chat" as const,
    props: options?.input ? { input: options.input } : {},
    windowCreationParams: {
      x: options?.x ?? 100,
      y: options?.y ?? 100,
      width: config.defaultWidth,
      height: config.defaultHeight,
      title: config.title,
      icon: config.icon,
    },
  };
}
