import { MenuItem } from "./types";
import { StartMenuItem } from "./StartMenuItem";

interface StartMenuLeftColumnProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  onAllProgramsClick: () => void;
}

export function StartMenuLeftColumn({
  items,
  onItemClick,
  onAllProgramsClick,
}: StartMenuLeftColumnProps) {
  return (
    <div
      style={{
        width: "195px",
        background: "white",
        borderRight: "1px solid #BFBFBF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, padding: "1px 0", overflow: "hidden" }}>
        {items.map((item, index) => (
          <div key={index}>
            {index === 2 && (
              <div
                style={{
                  height: "1px",
                  background: "#C5C5C5",
                  margin: "3px 8px",
                }}
              />
            )}
            <StartMenuItem item={item} onItemClick={onItemClick} />
          </div>
        ))}
      </div>

      {/* All Programs section */}
      <div
        style={{
          borderTop: "1px solid #C5C5C5",
          background: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 8px",
            cursor: "not-allowed",
            fontSize: "11px",
            fontWeight: "bold",
          }}
          onClick={onAllProgramsClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#316AC5";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "black";
          }}
        >
          <span>All Programs</span>
          <img
            src="/xp/all-programs.ico"
            alt="All Programs"
            style={{ width: "15px", height: "15px", marginLeft: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

