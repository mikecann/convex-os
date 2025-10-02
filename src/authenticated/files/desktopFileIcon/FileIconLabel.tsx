interface FileIconLabelProps {
  name: string;
}

export function FileIconLabel({ name }: FileIconLabelProps) {
  return (
    <span
      style={{
        fontSize: "12px",
        lineHeight: "1.2",
        maxWidth: "84px",
        padding: "0 2px",
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
      }}
    >
      {name}
    </span>
  );
}
