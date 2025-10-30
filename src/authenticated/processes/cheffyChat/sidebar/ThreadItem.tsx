import Box from "../../../../common/components/Box";
import type { MouseEvent } from "react";

interface ThreadItemProps {
  threadId: string;
  title: string | undefined;
  summary: string | undefined;
  isSelected: boolean;
  onSelect: () => void;
}

export function ThreadItem({
  threadId,
  title,
  summary,
  isSelected,
  onSelect,
}: ThreadItemProps) {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        if (!isSelected) {
          e.currentTarget.style.background = "#f0f0f0";
          e.currentTarget.style.border = "1px solid #919B9C";
        }
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        if (!isSelected) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.border = "1px solid transparent";
        }
      }}
      style={{
        cursor: "pointer",
        fontSize: "11px",
        fontFamily: "Tahoma, sans-serif",
        backgroundColor: isSelected ? "#D1E9FF" : "transparent",
        border: "1px solid transparent",
        borderRadius: "2px",
        marginBottom: "2px",
        padding: "8px",
      }}
    >
      <Box
        style={{
          fontWeight: isSelected ? "bold" : "normal",
          marginBottom: "4px",
        }}
      >
        {title || "Untitled Thread"}
      </Box>
      {summary ? (
        <Box
          style={{
            fontSize: "10px",
            color: "#666",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {summary}
        </Box>
      ) : null}
    </div>
  );
}

