export function StatusBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2px 4px",
        backgroundColor: "#ece9d8",
        borderTop: "1px solid #8b8b8b",
        fontSize: "11px",
        fontFamily: "Tahoma, sans-serif",
        height: "22px",
      }}
    >
      <span style={{ marginLeft: "4px" }}>Internet</span>
      <div
        style={{
          width: "16px",
          height: "16px",
          marginRight: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "14px" }}>🌐</span>
      </div>
    </div>
  );
}

