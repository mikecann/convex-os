import { ReactNode, useEffect } from "react";
import Horizontal from "../components/Horizontal";
import Vertical from "../components/Vertical";
import { Button } from "../components/Button";
import { LocalWindow } from "../../os/windowing/LocalWindow";
import { useKeydown } from "../hooks/useKeydown";
import { playSound } from "../sounds/soundEffects";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({
  isOpen,
  title = "Confirm",
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (isOpen) 
      playSound("balloon", 0.3);
    
  }, [isOpen]);

  useKeydown({
    enabled: isOpen,
    keys: ["Enter", "Escape"],
    handler: (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Enter") return;
      event.preventDefault();
      onConfirm();
    },
  });

  if (!isOpen) return null;

  return (
    <LocalWindow
      title={title}
      icon="/xp/dialog/help.png"
      showCloseButton
      onClose={onCancel}
      style={{ minWidth: "280px" }}
      viewState={{ kind: "open", viewStackOrder: 999, isActive: true }}
      width={320}
      height={200}
    >
      <Vertical gap={16} style={{ padding: "16px" }}>
        <div>{message}</div>
        <Horizontal gap={12} justify="end">
          <Button
            onClick={() => {
              onCancel();
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
            }}
            style={
              variant === "danger"
                ? {
                    background:
                      "linear-gradient(180deg, #f87171 0%, #dc2626 40%, #b91c1c 100%)",
                    color: "white",
                  }
                : {}
            }
          >
            {confirmLabel}
          </Button>
        </Horizontal>
      </Vertical>
    </LocalWindow>
  );
}
