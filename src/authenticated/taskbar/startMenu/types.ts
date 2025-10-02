export interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  onClick?: () => void;
  expanded?: boolean;
}

export interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
