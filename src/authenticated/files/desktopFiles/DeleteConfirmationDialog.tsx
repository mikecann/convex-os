import { ConfirmationDialog } from "../../../common/confirmation/ConfirmationDialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  fileCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  fileCount,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      title="Delete Files"
      message={`Are you sure you want to delete ${fileCount} item${fileCount === 1 ? "" : "s"}?`}
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="danger"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
