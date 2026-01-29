"use client";

import * as React from "react";
import tokens from "../../design-tokens.json";
import ChatMessageList from "./ChatMessageList";

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

export default function ChatDrawer({
  isOpen,
  onClose,
  preFillText,
  onPrefillConsumed,
}) {
  const [messages, setMessages] = React.useState([
    {
      id: "init",
      text: "Hey, ask away.",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [pendingSuggestion, setPendingSuggestion] = React.useState("");

  React.useEffect(() => {
    if (preFillText) {
      setPendingSuggestion(preFillText);
    }
  }, [preFillText, onPrefillConsumed]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMessage = {
      id: `user_${Date.now()}`,
      text,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const data = await response.json();
      const botMessage = {
        id: `bot_${Date.now()}`,
        text: data.response || "I had trouble answering that.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: "Sorry, I ran into an issue. Try again?",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = inputValue;
    setInputValue("");
    sendMessage(text);
  };

  const handleDismissSuggestion = () => {
    setPendingSuggestion("");
    if (onPrefillConsumed) {
      onPrefillConsumed();
    }
  };

  return (
    <aside
      style={{
        pointerEvents: isOpen ? "auto" : "none",
        position: "fixed",
        top: 0,
        right: 0,
        width: "320px",
        height: "100vh",
        background: tokens.colors.background,
        borderLeft: "0.5px solid",
        borderLeftColor: tokens.colors.dividers,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: tokens.spacing["16"],
          borderBottom: "0.5px solid",
          borderBottomColor: tokens.colors.dividers,
        }}
      >
        <div
          style={{
            ...typography.metadata,
            color: tokens.colors.meta,
          }}
        >
          CARMAHGPT
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chatbot"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            ...typography.metadata,
            color: tokens.colors.meta,
          }}
        >
          ✕
        </button>
      </div>

      <ChatMessageList messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          padding: tokens.spacing["16"],
          borderTop: "0.5px solid",
          borderTopColor: tokens.colors.dividers,
        }}
      >
        {pendingSuggestion ? (
          <div
            style={{
              position: "absolute",
              left: tokens.spacing["8"],
              right: tokens.spacing["8"],
              bottom: `calc(100% + ${tokens.spacing["8"]})`,
              background: "#E6E6E6",
              borderRadius: tokens.radius.sm,
              padding: tokens.spacing["8"],
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing["8"],
              zIndex: 2,
            }}
          >
            <div
              style={{
                ...typography.metadata,
                color: tokens.colors.meta,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {pendingSuggestion}
            </div>
            <button
              type="button"
              onClick={handleDismissSuggestion}
              aria-label="Dismiss suggestion"
              style={{
                border: "0.5px solid",
                borderColor: tokens.colors.dividers,
                borderRadius: tokens.radius.xs,
                background: "transparent",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...typography.metadata,
                color: tokens.colors.meta,
              }}
            >
              ✕
            </button>
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            gap: tokens.spacing["8"],
            alignItems: "center",
          }}
        >
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Ask about Carmah..."
            style={{
              flex: 1,
              border: "0.5px solid",
              borderColor: tokens.colors.dividers,
              borderRadius: tokens.radius.md,
              padding: tokens.spacing["8"],
              ...typography.bodyPrimary,
              color: tokens.colors.primaryBody,
              background: "transparent",
            }}
          />
          <button
            type="submit"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              ...typography.metadata,
              color: tokens.colors.meta,
            }}
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
