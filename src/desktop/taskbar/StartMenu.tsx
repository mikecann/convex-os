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
  subtitle?: string;
  onClick?: () => void;
  expanded?: boolean;
}

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const { signOut } = useAuthActions();
  const user = useQuery(api.auth.findMe);

  if (!isOpen) return null;

  const leftMenuItems: MenuItem[] = [
    { icon: "/xp/ie.png", label: "Internet", subtitle: "Internet Explorer" },
    { icon: "/xp/outlook.png", label: "E-mail", subtitle: "Outlook Express" },
    { icon: "/xp/cmd.png", label: "Command Prompt" },
    { icon: "/xp/msn.png", label: "MSN Messenger" },
    { icon: "/xp/mediaplayer.png", label: "Windows Media Player" },
    { icon: "/xp/solitaire.png", label: "Solitaire" },
    { icon: "/xp/paint.png", label: "Paint" },
    { icon: "/xp/help.png", label: "Tour Windows XP" },
  ];

  const rightMenuItems: MenuItem[] = [
    { icon: "/xp/folder.png", label: "My Documents" },
    { icon: "/xp/recentdoc.png", label: "My Recent Documents", expanded: true },
    { icon: "/xp/folder_image.png", label: "My Pictures" },
    { icon: "/xp/folder_music.png", label: "My Music" },
    { icon: "/xp/mycomputer.png", label: "My Computer" },
    { icon: "/xp/clipboard.png", label: "Control Panel" },
    { icon: "/xp/defaultprog.png", label: "Set Program Access and Defaults" },
    { icon: "/xp/printerfax.png", label: "Printers and Faxes" },
    { icon: "/xp/help.png", label: "Help and Support" },
    { icon: "/xp/search.png", label: "Search" },
    { icon: "/xp/run.png", label: "Run..." },
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
          bottom: "30px",
          left: "2px",
          width: "385px",
          height: "445px",
          background: "#245EDC",
          border: "3px ridge #C0C0C0",
          borderBottomColor: "#404040",
          borderRightColor: "#404040",
          borderRadius: "8px 8px 0 0",
          boxShadow: "4px 0 10px rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          overflow: "hidden",
          fontFamily: "MS Sans Serif, Arial, sans-serif",
        }}
      >
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
            padding: "10px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            height: "58px",
          }}
        >
          <img
            src="/xp/users.png"
            alt="User"
            style={{
              width: "48px",
              height: "48px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "3px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          />
          <span
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
            }}
          >
            {user?.name || user?.email || "User"}
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

        {/* Main menu content */}
        <div
          style={{
            display: "flex",
            height: "315px",
            overflow: "hidden",
          }}
        >
          {/* Left column - Programs */}
          <div
            style={{
              width: "195px",
              background: "white",
              borderRight: "1px solid #BFBFBF",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, padding: "3px 0", overflow: "hidden" }}>
              {leftMenuItems.map((item, index) => (
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: item.subtitle ? "4px 8px 2px 8px" : "6px 8px",
                      cursor: "pointer",
                      minHeight: item.subtitle ? "34px" : "26px",
                    }}
                    onClick={() => handleMenuItemClick(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#316AC5";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      style={{
                        width: "24px",
                        height: "24px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: item.subtitle ? "bold" : "normal",
                          lineHeight: "1.2",
                        }}
                      >
                        {item.label}
                      </span>
                      {item.subtitle && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#666",
                            lineHeight: "1.1",
                          }}
                        >
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
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
                  padding: "8px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
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

          {/* Right column - System items */}
          <div
            style={{
              width: "190px",
              background:
                "linear-gradient(to bottom, #E8F4FD 0%, #D6EBFA 100%)",
              padding: "3px 0",
              overflow: "hidden",
            }}
          >
            {rightMenuItems.map((item, index) => (
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 8px",
                    cursor: "pointer",
                    fontSize: "11px",
                    minHeight: "26px",
                  }}
                  onClick={() => handleMenuItemClick(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#316AC5";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "black";
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{
                      width: "16px",
                      height: "16px",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.expanded && (
                    <span style={{ fontSize: "8px", color: "#666" }}>▶</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            height: "60px",
            background: "linear-gradient(to bottom, #4B7CE8 0%, #2E5BDC 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 12px",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            gap: "6px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              cursor: "pointer",
              background:
                "linear-gradient(to bottom, #FF9D3F 0%, #E67C00 100%)",
              border: "1px solid #CC6600",
              borderRadius: "3px",
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.1)",
            }}
            onClick={handleLogOff}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(to bottom, #FFB366 0%, #F28A1A 100%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(to bottom, #FF9D3F 0%, #E67C00 100%)";
            }}
          >
            <img
              src="/xp/logoff.png"
              alt="Log Off"
              style={{ width: "16px", height: "16px" }}
            />
            <span
              style={{
                color: "white",
                fontSize: "11px",
                fontWeight: "bold",
                textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
              }}
            >
              Log Off
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              cursor: "pointer",
              background:
                "linear-gradient(to bottom, #FF6B6B 0%, #CC0000 100%)",
              border: "1px solid #990000",
              borderRadius: "3px",
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.1)",
            }}
            onClick={handleTurnOffComputer}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(to bottom, #FF8888 0%, #DD1A1A 100%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(to bottom, #FF6B6B 0%, #CC0000 100%)";
            }}
          >
            <img
              src="/xp/shutdown.png"
              alt="Turn Off"
              style={{ width: "16px", height: "16px" }}
            />
            <span
              style={{
                color: "white",
                fontSize: "11px",
                fontWeight: "bold",
                textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
              }}
            >
              Turn Off Computer
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
