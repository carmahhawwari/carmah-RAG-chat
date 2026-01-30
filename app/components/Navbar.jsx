"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import tokens from "../../design-tokens.json";

const resolveFontFamily = (value) => {
  if (typeof value !== "string") return value;
  const match = value.match(/^\{fontFamilies\.([a-zA-Z0-9]+)\}$/);
  if (!match) return value;
  return tokens.fontFamilies[match[1]] || value;
};

const typography = Object.fromEntries(
  Object.entries(tokens.typography).map(([key, style]) => [
    key,
    {
      ...style,
      fontFamily: resolveFontFamily(style.fontFamily),
    },
  ])
);

const navItems = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
];

const isActiveRoute = (href, pathname) => {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
};

export default function Navbar() {
  const pathname = usePathname() || "/";
  const handleChatClick = () => {
    window.dispatchEvent(new CustomEvent("open-chat-drawer"));
  };

  return (
    <div
      style={{
        position: "sticky",
        top: tokens.spacing["24"],
        zIndex: 60,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <nav
        aria-label="Primary"
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing["8"],
          padding: `${tokens.spacing["8"]} ${tokens.spacing["12"]}`,
          borderRadius: tokens.radius.pill,
          border: "0.5px solid",
          borderColor: tokens.colors.dividers,
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
        }}
      >
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...typography.bodyPrimary,
                color: tokens.colors.primary,
                textDecoration: "none",
                padding: `${tokens.spacing["8"]} ${tokens.spacing["16"]}`,
                borderRadius: tokens.radius.pill,
                border: isActive ? "0.5px solid" : "0.5px solid transparent",
                borderColor: isActive ? tokens.colors.dividers : "transparent",
                background: isActive ? "rgba(255, 255, 255, 0.9)" : "transparent",
                boxShadow: isActive ? "0 6px 16px rgba(0, 0, 0, 0.08)" : "none",
                transition: "background 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleChatClick}
          style={{
            ...typography.bodyPrimary,
            color: tokens.colors.primary,
            padding: `${tokens.spacing["8"]} ${tokens.spacing["16"]}`,
            borderRadius: tokens.radius.pill,
            border: "0.5px solid transparent",
            background: "transparent",
            cursor: "pointer",
            transition: "background 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          Chat
        </button>
      </nav>
    </div>
  );
}
