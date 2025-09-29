import React from "react";
import { Clock } from "./Clock";

export function SystemTray() {
  return (
    <div
      style={{
        marginLeft: "auto",
        height: "100%",
        width: "fit-content",
        color: "white",
        borderTop: "1px solid #075dca",
        borderBottom: "1px solid #0a5bc6",
        borderRight: "1px solid transparent",
        borderLeft: "1px solid black",
        backgroundImage:
          "linear-gradient(0deg, #0a5bc6 0%, #1198e9 6%, #1198e9 51%, #1198e9 63%, #1198e9 77%, #19b9f3 95%, #075dca 97%)",
        boxShadow: "2px 0px 3px #20e2fc inset",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingTop: "1px",
        fontSize: "14px",
        gap: "4px",
      }}
    >
      <Clock />
    </div>
  );
}
