export function LinksBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
        height: "22px",
        borderLeft: "1px solid #8b8b8b",
        marginLeft: "2px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontFamily: "Tahoma, sans-serif",
          color: "#000",
          marginRight: "4px",
        }}
      >
        Links
      </span>
      <span style={{ fontSize: "10px", color: "#666" }}>»</span>
    </div>
  );
}
