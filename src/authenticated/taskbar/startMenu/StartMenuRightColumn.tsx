import { MenuItem } from "./types";
import { StartMenuItem } from "./StartMenuItem";

interface StartMenuRightColumnProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export function StartMenuRightColumn({
  items,
  onItemClick,
}: StartMenuRightColumnProps) {
  return (
    <div
      style={{
        width: "190px",
        background: "linear-gradient(to bottom, #E8F4FD 0%, #D6EBFA 100%)",
        padding: "1px 0",
        overflow: "hidden",
      }}
    >
      {items.map((item, index) => (
        <div key={index}>
          {(index === 5 || index === 8) && (
            <div
              style={{
                height: "1px",
                background: "#9CBEE8",
                margin: "3px 8px",
              }}
            />
          )}
          <StartMenuItem
            item={item}
            onItemClick={onItemClick}
            background="transparent"
          />
        </div>
      ))}
    </div>
  );
}

