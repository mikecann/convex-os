import { MenuItem } from "./types";

export const leftMenuItems: MenuItem[] = [
  {
    icon: "/xp/ie.png",
    label: "Internet",
    subtitle: "Internet Explorer",
    processKind: "internet_explorer",
  },
  { icon: "/xp/outlook.png", label: "E-mail", subtitle: "Outlook Express" },
  {
    icon: "/xp/image.png",
    label: "Image Preview",
    processKind: "image_preview",
  },
  {
    icon: "/xp/mediaplayer.png",
    label: "Video Player",
    processKind: "video_player",
  },
  { icon: "/xp/doc.png", label: "Text Preview", processKind: "text_preview" },
  { icon: "/cheffy.webp", label: "Cheffy Chat", processKind: "cheffy_chat" },
  {
    icon: "/xp/github.png",
    label: "View on GitHub",
    onClick: () =>
      window.open("https://github.com/mikecann/convex-os", "_blank"),
  },
  {
    icon: "/convex.svg",
    label: "Convex Dashboard",
    onClick: () => {
      const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
      // Extract deployment ID from URL like https://{deployment-id}.convex.cloud
      const deploymentIdMatch = convexUrl.match(/https?:\/\/([^.]+)\.convex\./);
      const deploymentId = deploymentIdMatch?.[1] ?? "unknown";
      window.open(`https://dashboard.convex.dev/d/${deploymentId}`, "_blank");
    },
  },
];

export const rightMenuItems: MenuItem[] = [
  { icon: "/xp/folder.png", label: "My Documents" },
  { icon: "/xp/recentdoc.png", label: "My Recent Documents", expanded: true },
  { icon: "/xp/folder_image.png", label: "My Pictures" },
  { icon: "/xp/folder_music.png", label: "My Music" },
  { icon: "/xp/mycomputer.png", label: "My Computer" },
  { icon: "/xp/clipboard.png", label: "Control Panel" },
  { icon: "/xp/defaultprog.png", label: "Set Program Access and Defaults" },
  { icon: "/xp/printerfax.png", label: "Printers and Faxes" },
  { icon: "/xp/help.png", label: "Help and Support" },
  { icon: "/xp/search.png", label: "Search" },
  { icon: "/xp/run.png", label: "Run..." },
];
