import { Desktop } from "./Desktop";
import { DesktopFiles } from "./files/DesktopFiles";
import { Taskbar } from "./taskbar/Taskbar";
import { StartMenu } from "./taskbar/StartMenu";
import { WindowingRenderer } from "../windowing/WindowingRenderer";
import { DesktopContext } from "./DesktopContext";

export function UnauthenticatedDesktop() {
  return <Desktop></Desktop>;
}
