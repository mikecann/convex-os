export function MenuBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "22px",
        padding: "0 2px",
        backgroundColor: "#ece9d8",
        fontSize: "11px",
        fontFamily: "Tahoma, sans-serif",
        flexShrink: 0,
        paddingRight: "10px",
        borderRight: "1px solid #c3c3c3",
      }}
    >
      {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((menu) => (
        <div
          key={menu}
          style={{
            padding: "2px 8px",
            cursor: "pointer",
            color: "#000",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#316ac5";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#000";
          }}
        >
          {menu}
        </div>
      ))}
    </div>
  );
}
