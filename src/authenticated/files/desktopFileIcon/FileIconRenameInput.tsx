import { RefObject } from "react";

interface FileIconRenameInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function FileIconRenameInput({
  inputRef,
  value,
  onChange,
  onSubmit,
  onCancel,
}: FileIconRenameInputProps) {
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onSubmit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onSubmit();
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }}
      style={{
        fontSize: "12px",
        lineHeight: "1.2",
        maxWidth: "84px",
        width: "100%",
        padding: "2px",
        borderRadius: "4px",
        border: "1px solid rgba(255,255,255,0.8)",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        textAlign: "center",
        outline: "none",
      }}
      spellCheck={false}
    />
  );
}
