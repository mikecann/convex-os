import Box from "../../../../common/components/Box";
import type { MouseEvent } from "react";

interface ThreadItemProps {
  threadId: string;
  title: string | undefined;
  summary: string | undefined;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ThreadItem({
  threadId,
  title,
  summary,
  isSelected,
  onSelect,
  onDelete,
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
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <Box style={{ flex: 1, minWidth: 0 }}>
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
      </Box>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.color = "#000";
          e.currentTarget.style.backgroundColor = "#e0e0e0";
          e.currentTarget.style.borderRadius = "2px";
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.color = "#666";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        style={{
          width: "auto",
          height: "auto",
          minWidth: "0",
          minHeight: "0",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px 4px",
          margin: "0",
          fontSize: "14px",
          lineHeight: "1",
          color: "#666",
          boxShadow: "none",
          outline: "none",
          backgroundColor: "transparent",
          backgroundImage: "none",
          flexShrink: 0,
          transition: "background-color 0.15s ease, color 0.15s ease",
        }}
        title="Delete thread"
      >
        ×
      </button>
    </div>
  );
}

