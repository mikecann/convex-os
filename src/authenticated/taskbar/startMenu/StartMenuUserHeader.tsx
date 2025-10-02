interface StartMenuUserHeaderProps {
  userName: string;
}

export function StartMenuUserHeader({ userName }: StartMenuUserHeaderProps) {
  return (
    <>
      {/* White top border */}
      <div
        style={{
          height: "2px",
          background: "white",
          width: "100%",
        }}
      />

      {/* User section header */}
      <div
        style={{
          background:
            "linear-gradient(to right, #5A8DEE 0%, #4577DC 50%, #245EDC 100%)",
          padding: "6px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "48px",
        }}
      >
        <img
          src="/xp/users.png"
          alt="User"
          style={{
            width: "40px",
            height: "40px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "3px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
        <span
          style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
          }}
        >
          {userName}
        </span>
      </div>

      {/* Orange separator */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(to right, #FF9500 0%, #FF7A00 100%)",
          borderBottom: "1px solid #D4640A",
        }}
      />
    </>
  );
}

