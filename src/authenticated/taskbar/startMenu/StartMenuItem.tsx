import { MenuItem } from "./types";

interface StartMenuItemProps {
  item: MenuItem;
  onItemClick: (item: MenuItem) => void;
  background?: string;
  hoverBackground?: string;
}

export function StartMenuItem({
  item,
  onItemClick,
  background = "transparent",
  hoverBackground = "#316AC5",
}: StartMenuItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: item.subtitle ? "2px 8px 1px 8px" : "3px 8px",
        cursor: item.onClick || item.processKind ? "pointer" : "not-allowed",
        minHeight: item.subtitle ? "30px" : "22px",
        fontSize: "11px",
      }}
      onClick={() => onItemClick(item)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBackground;
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = background;
        e.currentTarget.style.color = "black";
      }}
    >
      <img
        src={item.icon}
        alt={item.label}
        style={{
          width: item.subtitle ? "24px" : "16px",
          height: item.subtitle ? "24px" : "16px",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: item.subtitle ? "bold" : "normal",
            lineHeight: "1.2",
          }}
        >
          {item.label}
        </span>
        {item.subtitle && (
          <span
            style={{
              fontSize: "10px",
              color: "#666",
              lineHeight: "1.1",
            }}
          >
            {item.subtitle}
          </span>
        )}
      </div>
      {item.expanded && (
        <span style={{ fontSize: "8px", color: "#666" }}>▶</span>
      )}
    </div>
  );
}
