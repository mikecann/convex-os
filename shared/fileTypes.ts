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

const EXTENSION_TO_MIME_TYPE: Record<string, string> = {
  // Images
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  webp: "image/webp",
  // Videos
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  // Audio
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  // Text files
  txt: "text/plain",
  md: "text/markdown",
  json: "application/json",
  xml: "text/xml",
  csv: "text/csv",
  log: "text/plain",
  js: "text/javascript",
  ts: "text/typescript",
  tsx: "text/typescript",
  jsx: "text/javascript",
  css: "text/css",
  html: "text/html",
  py: "text/x-python",
  java: "text/x-java-source",
  c: "text/x-c",
  cpp: "text/x-c++",
  h: "text/x-c",
  hpp: "text/x-c++",
  rs: "text/x-rust",
  go: "text/x-go",
  sh: "text/x-shellscript",
  bat: "text/x-msdos-batch",
  yaml: "text/yaml",
  yml: "text/yaml",
  toml: "text/x-toml",
  ini: "text/plain",
  conf: "text/plain",
  cfg: "text/plain",
  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Archives
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  "7z": "application/x-7z-compressed",
  // Executables
  exe: "application/x-msdownload",
  dmg: "application/x-apple-diskimage",
};

export function getMimeTypeFromFilename(
  filename: string,
  fallbackType?: string,
): string {
  const extension = getFileExtension(filename);
  if (extension && EXTENSION_TO_MIME_TYPE[extension])
    return EXTENSION_TO_MIME_TYPE[extension];

  return fallbackType || "application/octet-stream";
}
