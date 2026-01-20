import * as React from "react"
import { addPropertyControls } from "framer"

export default function Chatbot() {
  const [messages, setMessages] = React.useState([
    { text: "Try asking about internships, projects, or skills.", isUser: false },
  ])
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
    }
  }

  // Typography + spacing controls
  const MESSAGE_FONT_SIZE = 18
  const MESSAGE_LINE_HEIGHT = 1.35
  const MESSAGE_PADDING = "7px 10px"

  const askCarmah = async (question: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        "https://carmah-chatbot-cxqrdhpwx-chawwari-stanfordedus-projects.vercel.app/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: question }),
        }
      )
      const data = await response.json()
      return data.response
    } catch (err) {
      console.error(err)
      return "Sorry, I had trouble answering that question. Please try again!"
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = { text: inputValue, isUser: true }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    const response = await askCarmah(userMessage.text)
    const botMessage = { text: response, isUser: false }
    setMessages((prev) => [...prev, botMessage])
  }

  // Handle Enter to submit, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const MAX_WIDTH = 400
  const MAX_HEIGHT = 400
  const INPUT_CLASS = "carmah-chatbot-input"

  return (
    <div
      className="cb-chatbot"
      style={{
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background: "#F6F6F4",
        borderRadius: 12,
        border: "1px solid rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* Force Helvetica Neue Regular everywhere in this component */
        .cb-chatbot {
          font-family: "Helvetica Neue", sans-serif;
          font-weight: 400;
          font-synthesis: none;
        }
        .cb-chatbot * {
          font-family: "Helvetica Neue", sans-serif !important;
          font-weight: 400;
        }
        .${INPUT_CLASS}::placeholder {
          color: #000000;
          opacity: 0.5;
          font-family: "Helvetica Neue", sans-serif !important;
          font-weight: 400;
        }
        .${INPUT_CLASS} {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) transparent;
        }
        .${INPUT_CLASS}::-webkit-scrollbar {
          width: 4px;
        }
        .${INPUT_CLASS}::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
        }

        /* Ensure all text elements use the font */
        .cb-chatbot input,
        .cb-chatbot textarea,
        .cb-chatbot button,
        .cb-chatbot div,
        .cb-chatbot span {
          font-family: "Helvetica Neue", sans-serif !important;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          paddingTop: "28px",
          paddingRight: "14px",
          paddingBottom: "6px",
          paddingLeft: "14px",
          background: "#F6F6F4",
          textAlign: "center",
          fontSize: 24,
          fontWeight: 400,
          lineHeight: 1.2,
          color: "#000000",
          fontFamily: "Helvetica Neue, sans-serif",
        }}
      >
        Curious? Ask my chatbot.
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#F6F6F4",
          overscrollBehavior: "contain",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: "8px 14px 8px",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.isUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: m.isUser ? MESSAGE_PADDING : "7px 0",
                  borderRadius: m.isUser ? 14 : 0,
                  backgroundColor: m.isUser ? "#F7F7F5" : "transparent",
                  color: m.isUser ? "#000000" : "#6b7280",
                  fontSize: MESSAGE_FONT_SIZE,
                  lineHeight: MESSAGE_LINE_HEIGHT,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontWeight: 400,
                  fontFamily: "Helvetica Neue, sans-serif",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  padding: "7px 0",
                  backgroundColor: "transparent",
                  color: "#6b7280",
                  fontSize: MESSAGE_FONT_SIZE,
                  lineHeight: MESSAGE_LINE_HEIGHT,
                  fontWeight: 400,
                  fontFamily: "Helvetica Neue, sans-serif",
                }}
              >
                Carmah is typing…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} style={{ background: "#F6F6F4" }}>
        <div style={{ padding: "8px 14px 12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              padding: 6,
              borderRadius: 24,
              background: "#F9F9F6",
              border: "0.5px solid rgba(0, 0, 0, 0.1)",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.03)",
            }}
          >
            <textarea
              ref={textareaRef}
              className={INPUT_CLASS}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                adjustTextareaHeight()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              disabled={isLoading}
              autoFocus={false}
              rows={1}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "none",
                outline: "none",
                fontSize: 16,
                background: "transparent",
                color: "#000000",
                fontWeight: 400,
                fontFamily: "Helvetica Neue, sans-serif",
                resize: "none",
                overflow: "hidden",
                minHeight: "40px",
                maxHeight: "120px",
                lineHeight: 1.4,
              }}
            />
            {/* Arrow submit button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: 20,
                cursor: inputValue.trim() && !isLoading ? "pointer" : "not-allowed",
                transition: "opacity 0.2s ease",
                opacity: inputValue.trim() && !isLoading ? 1 : 0.5,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="#000000"
                viewBox="0 0 24 24"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

addPropertyControls(Chatbot, {})
