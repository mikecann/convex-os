import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";

export type MenuItem = {
  label: string;
  onClick?: () => void;
  items?: MenuItem[];
};

export type MenuBarProps = {
  items: MenuItem[];
};

export function MenuBar({ items }: MenuBarProps) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenuIndex === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(event.target as Node)
      )
        setOpenMenuIndex(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuIndex]);

  return (
    <div
      ref={menuBarRef}
      style={{
        display: "flex",
        backgroundColor: "#ECE9D8",
        borderBottom: "1px solid #919B9C",
        padding: "2px 0",
        position: "relative",
        userSelect: "none",
      }}
    >
      {items.map((item, index) => (
        <div key={index} style={{ position: "relative" }}>
          <Button
            onClick={() => {
              if (openMenuIndex === index) setOpenMenuIndex(null);
              else setOpenMenuIndex(index);
            }}
            style={{
              padding: "4px 12px",
              border: "none",
              background: openMenuIndex === index ? "#fff" : "transparent",
              cursor: "pointer",
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
              minWidth: "30px",
            }}
            onMouseEnter={(e) => {
              if (openMenuIndex === null)
                e.currentTarget.style.background = "#D1E9FF";
            }}
            onMouseLeave={(e) => {
              if (openMenuIndex !== index)
                e.currentTarget.style.background = "transparent";
            }}
          >
            {item.label}
          </Button>
          {openMenuIndex === index && item.items && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                minWidth: "100px",
                backgroundColor: "#fff",
                border: "1px solid #0054E3",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                zIndex: 10000,
                whiteSpace: "nowrap",
              }}
            >
              {item.items.map((subItem, subIndex) => (
                <button
                  key={subIndex}
                  onClick={() => {
                    subItem.onClick?.();
                    setOpenMenuIndex(null);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "4px 12px",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontFamily: "Tahoma, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#316AC5";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#000";
                  }}
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
