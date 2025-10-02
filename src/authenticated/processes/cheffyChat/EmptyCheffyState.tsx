import { CheffyCharacter } from "../../cheffy/CheffyCharacter";

export function EmptyCheffyState() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "40px",
      }}
    >
      <div style={{ position: "relative" }}>
        {/* Speech Bubble */}
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "20px",
            backgroundColor: "white",
            border: "2px solid #242424",
            borderRadius: "20px",
            padding: "20px 30px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            minWidth: "300px",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 500,
              color: "#202124",
            }}
          >
            What would you like to Cook?
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "14px",
              color: "#5f6368",
            }}
          >
            Try dragging some files onto here
          </p>
        </div>

        {/* Cheffy Character */}
        <div style={{ transform: "scale(1.5)" }}>
          <CheffyCharacter />
        </div>
      </div>
    </div>
  );
}
