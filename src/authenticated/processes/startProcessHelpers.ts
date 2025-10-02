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

export function getProcessConfig(kind: ProcessKinds): ProcessConfig {
  return processConfigs[kind];
}

type ProcessStartParams<K extends ProcessKinds = ProcessKinds> = K extends
  | "image_preview"
  | "video_player"
  | "text_preview"
  ? {
      kind: K;
      props: { fileId?: Id<"files"> };
      windowCreationParams: {
        x: number;
        y: number;
        width: number;
        height: number;
        title: string;
        icon: string;
      };
    }
  : {
      kind: K;
      props: {};
      windowCreationParams: {
        x: number;
        y: number;
        width: number;
        height: number;
        title: string;
        icon: string;
      };
    };

export function createProcessStartParams<K extends ProcessKinds>(
  kind: K,
  overrides?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    title?: string;
    icon?: string;
    fileId?: Id<"files">;
    fileName?: string;
  },
): ProcessStartParams<K> {
  const config = getProcessConfig(kind);

  const title =
    overrides?.title ??
    (overrides?.fileName
      ? `${overrides.fileName} - ${config.title}`
      : config.title);

  const baseParams = {
    kind,
    windowCreationParams: {
      x: overrides?.x ?? 100,
      y: overrides?.y ?? 100,
      width: overrides?.width ?? config.defaultWidth,
      height: overrides?.height ?? config.defaultHeight,
      title,
      icon: overrides?.icon ?? config.icon,
    },
  };

  if (
    kind === "image_preview" ||
    kind === "video_player" ||
    kind === "text_preview"
  ) {
    return {
      ...baseParams,
      props: overrides?.fileId ? { fileId: overrides.fileId } : {},
    } as ProcessStartParams<K>;
  }

  return {
    ...baseParams,
    props: {},
  } as ProcessStartParams<K>;
}
