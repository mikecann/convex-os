export const IMAGE_EXTENSIONS: ReadonlySet<string> = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "svg",
  "webp",
]);

export const VIDEO_EXTENSIONS: ReadonlySet<string> = new Set([
  "mp4",
  "webm",
  "ogg",
]);

export const TEXT_EXTENSIONS: ReadonlySet<string> = new Set([
  "txt",
  "md",
  "json",
  "xml",
  "csv",
  "log",
  "js",
  "ts",
  "tsx",
  "jsx",
  "css",
  "html",
  "py",
  "java",
  "c",
  "cpp",
  "h",
  "hpp",
  "rs",
  "go",
  "sh",
  "bat",
  "yaml",
  "yml",
  "toml",
  "ini",
  "conf",
  "cfg",
]);

export const EXTENSION_ICON_MAP: Record<string, string> = {
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
  pdf: "/xp/help.png",
  doc: "/xp/doc.png",
  docx: "/xp/doc.png",
  txt: "/xp/doc.png",
  md: "/xp/doc.png",
  json: "/xp/doc.png",
  js: "/xp/doc.png",
  ts: "/xp/doc.png",
  html: "/xp/doc.png",
  css: "/xp/doc.png",
  zip: "/xp/help.png",
  rar: "/xp/help.png",
  "7z": "/xp/help.png",
  exe: "/xp/help.png",
  dmg: "/xp/help.png",
};

export const MIME_ICON_MAP: Record<string, string> = {
  "image/png": "/xp/image.png",
  "image/jpeg": "/xp/image.png",
  "image/gif": "/xp/image.png",
  "application/pdf": "/xp/help.png",
  "audio/mpeg": "/xp/mediaplayer.png",
  "audio/wav": "/xp/sound.png",
  "video/mp4": "/xp/mediaplayer.png",
};

export const DEFAULT_ICON = "/xp/doc.png";

type FileWithNameAndType = {
  name: string;
  type?: string;
};

export function isImageFile(file: FileWithNameAndType): boolean {
  if (file.type?.startsWith("image/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return false;
  return IMAGE_EXTENSIONS.has(extension);
}

export function isVideoFile(file: FileWithNameAndType): boolean {
  if (file.type?.startsWith("video/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return false;
  return VIDEO_EXTENSIONS.has(extension);
}

export function isTextFile(file: FileWithNameAndType): boolean {
  if (file.type?.startsWith("text/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return false;
  return TEXT_EXTENSIONS.has(extension);
}

export function getFileExtension(filename: string): string | null {
  return filename.split(".").pop()?.toLowerCase() ?? null;
}
