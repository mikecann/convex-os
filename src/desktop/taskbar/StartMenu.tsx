import React from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: string;
  label: string;
  onClick?: () => void;
}

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const { signOut } = useAuthActions();
  const user = useQuery(api.auth.currentUser);

  if (!isOpen) return null;

  const leftMenuItems: MenuItem[] = [
    { icon: "🌐", label: "Internet Explorer" },
    { icon: "📧", label: "E-mail" },
    { icon: "⬛", label: "Command Prompt" },
    { icon: "🟢", label: "MSN" },
    { icon: "🎵", label: "Windows Media Player" },
    { icon: "💬", label: "Windows Messenger" },
    { icon: "📄", label: "Notepad" },
    { icon: "ℹ️", label: "Tour Windows XP" },
  ];

  const rightMenuItems: MenuItem[] = [
    { icon: "📁", label: "My Documents" },
    { icon: "📄", label: "My Recent Documents" },
    { icon: "🖼️", label: "My Pictures" },
    { icon: "🎵", label: "My Music" },
    { icon: "💻", label: "My Computer" },
    { icon: "⚙️", label: "Control Panel" },
    { icon: "🔧", label: "Set Program Access and Defaults" },
    { icon: "🖨️", label: "Printers and Faxes" },
    { icon: "❓", label: "Help and Support" },
    { icon: "🔍", label: "Search" },
    { icon: "🏃", label: "Run..." },
  ];

  const handleLogOff = () => {
    void signOut();
    onClose();
  };

  const handleTurnOffComputer = () => {
    window.close();
    onClose();
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop to close menu when clicked outside */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
        }}
        onClick={onClose}
      />

      {/* Start Menu */}
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          left: "2px",
          width: "320px",
          height: "450px",
          background: "linear-gradient(to bottom, #245EDC 0%, #1E4DB5 100%)",
          border: "2px outset #245EDC",
          borderRadius: "8px 8px 0 0",
          boxShadow: "2px -2px 6px rgba(0,0,0,0.3)",
          zIndex: 999,
          overflow: "hidden",
        }}
      >
        {/* User section */}
        <div
          style={{
            background: "linear-gradient(to bottom, #4080FF 0%, #245EDC 100%)",
            padding: "8px 16px",
            borderBottom: "1px solid #0831D9",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background:
                "linear-gradient(to bottom, #FFD700 0%, #FFA500 100%)",
              borderRadius: "4px",
              border: "1px solid #FF8C00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            👤
          </div>
          <span
            style={{
              color: "white",
              fontFamily: "MS Sans Serif, sans-serif",
              fontSize: "12px",
              fontWeight: "bold",
              textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
            }}
          >
            {user?.email || "User"}
          </span>
        </div>

        {/* Main menu content */}
        <div
          style={{
            display: "flex",
            height: "calc(100% - 100px)",
            background: "white",
          }}
        >
          {/* Left column - Programs */}
          <div
            style={{
              width: "50%",
              background: "white",
              borderRight: "1px solid #C0C0C0",
            }}
          >
            {leftMenuItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "MS Sans Serif, sans-serif",
                }}
                onClick={() => handleMenuItemClick(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#316AC5";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "black";
                }}
              >
                <span style={{ fontSize: "16px", width: "16px" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Right column - Folders and system items */}
          <div
            style={{
              width: "50%",
              background: "#E6F3FF",
            }}
          >
            {rightMenuItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "MS Sans Serif, sans-serif",
                }}
                onClick={() => handleMenuItemClick(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#316AC5";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#E6F3FF";
                  e.currentTarget.style.color = "black";
                }}
              >
                <span style={{ fontSize: "16px", width: "16px" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.label === "My Recent Documents" && (
                  <span style={{ marginLeft: "auto", fontSize: "8px" }}>
                    ▶
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            height: "50px",
            background: "linear-gradient(to bottom, #245EDC 0%, #1E4DB5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 8px",
            borderTop: "1px solid #4080FF",
          }}
        >
          {/* All Programs button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              cursor: "pointer",
              color: "white",
              fontSize: "11px",
              fontFamily: "MS Sans Serif, sans-serif",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span>All Programs</span>
            <span style={{ fontSize: "8px" }}>▶</span>
          </div>

          {/* Log Off and Turn Off Computer buttons */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              style={{
                background:
                  "linear-gradient(to bottom, #FF9D3F 0%, #F25C05 100%)",
                border: "1px outset #FF9D3F",
                color: "white",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                padding: "4px 8px",
                cursor: "pointer",
                borderRadius: "2px",
                textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
              }}
              onClick={handleLogOff}
            >
              📤 Log Off
            </button>
            <button
              style={{
                background:
                  "linear-gradient(to bottom, #FF6B6B 0%, #CC0000 100%)",
                border: "1px outset #FF6B6B",
                color: "white",
                fontSize: "11px",
                fontFamily: "MS Sans Serif, sans-serif",
                padding: "4px 8px",
                cursor: "pointer",
                borderRadius: "2px",
                textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
              }}
              onClick={handleTurnOffComputer}
            >
              🔌 Turn Off Computer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
