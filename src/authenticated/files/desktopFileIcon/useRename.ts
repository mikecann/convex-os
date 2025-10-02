import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import { DesktopFileDoc } from "./DesktopFileIcon";

export function useRename(file: DesktopFileDoc) {
  const renameFile = useMutation(api.my.files.rename);
  const onError = useErrorHandler();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(file.name);
  const renamedDuringSessionRef = useRef(false);

  useEffect(() => {
    if (!isRenaming) return;
    if (!inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.select();
  }, [isRenaming]);

  useEffect(() => {
    if (isRenaming) return;
    setNameDraft(file.name);
    renamedDuringSessionRef.current = false;
  }, [file.name, isRenaming]);

  const handleRenameSubmit = async () => {
    const trimmedName = nameDraft.trim();

    if (trimmedName.length === 0) {
      setNameDraft(file.name);
      setIsRenaming(false);
      return;
    }

    if (trimmedName === file.name) {
      setIsRenaming(false);
      return;
    }

    await renameFile({ fileId: file._id, name: trimmedName })
      .catch(onError)
      .finally(() => setIsRenaming(false));
  };

  const startRename = () => {
    if (renamedDuringSessionRef.current) return;
    setNameDraft(file.name);
    setIsRenaming(true);
    renamedDuringSessionRef.current = true;
  };

  const cancelRename = () => {
    setNameDraft(file.name);
    setIsRenaming(false);
  };

  return {
    isRenaming,
    nameDraft,
    inputRef,
    setNameDraft,
    handleRenameSubmit,
    startRename,
    cancelRename,
  };
}
