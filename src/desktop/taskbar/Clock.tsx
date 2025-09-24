import React, { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      style={{
        color: "white",
        fontSize: "12px",
        fontFamily: "MS Sans Serif, sans-serif",
        padding: "2px 8px",
        minWidth: "60px",
        textAlign: "center",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {formatTime(time)}
    </div>
  );
}
