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

export default function ChatMessageList({ messages, isLoading }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: tokens.spacing["16"],
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing["12"],
      }}
    >
      {messages.map((message, index) => (
        <div
          key={`${message.id}-${index}`}
          style={{
            display: "flex",
            justifyContent: message.isUser ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "85%",
              padding: message.isUser ? tokens.spacing["12"] : "0",
              borderRadius: tokens.radius.lg,
              background: message.isUser ? "#F2F2EE" : "transparent",
              ...typography.bodyPrimary,
              color: tokens.colors.primaryBody,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {message.text}
          </div>
        </div>
      ))}
      {isLoading && (
        <div
          style={{
            ...typography.bodyPrimary,
            color: tokens.colors.secondary,
          }}
        >
          Thinking...
        </div>
      )}
    </div>
  );
}
