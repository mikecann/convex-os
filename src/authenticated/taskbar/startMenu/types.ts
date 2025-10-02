import { ProcessKinds } from "../../../../convex/processes/schema";

export interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  onClick?: () => void;
  expanded?: boolean;
  processKind?: ProcessKinds;
}

export interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
