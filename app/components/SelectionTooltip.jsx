"use client";

import * as React from "react";
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

export default function SelectionTooltip({ onAsk }) {
  const [selection, setSelection] = React.useState("");
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString() || "";
      if (!selectedText.trim()) {
        setSelection("");
        return;
      }
      const range = window.getSelection()?.getRangeAt(0);
      if (!range) return;
      const rect = range.getBoundingClientRect();
      setSelection(selectedText.trim());
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  if (!selection) return null;

  return (
    <button
      type="button"
      onClick={() => onAsk(selection)}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -100%)",
        background: tokens.colors.background,
        border: "0.5px solid",
        borderColor: tokens.colors.dividers,
        borderRadius: tokens.radius.pill,
        padding: `${tokens.spacing["4"]} ${tokens.spacing["8"]}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        ...typography.metadata,
        color: tokens.colors.meta,
        cursor: "pointer",
        zIndex: 60,
      }}
    >
      Ask about this
    </button>
  );
}
