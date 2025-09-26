import { ReactNode } from "react";
import Horizontal from "../components/Horizontal";
import Vertical from "../components/Vertical";
import { Button } from "../components/Button";
import { Window } from "../components/Window";
import { useKeydown } from "../hooks/useKeydown";

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
    <Window
      title={title}
      showCloseButton
      onClose={onCancel}
      style={{ minWidth: "280px" }}
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
    </Window>
  );
}
