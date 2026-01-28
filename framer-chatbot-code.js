import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function Chatbot() {
    const [messages, setMessages] = React.useState([
        {
            text: "Hi! I'm Carmah. Ask me anything about my background, experience, or projects!",
            isUser: false,
        },
    ])
    const [inputValue, setInputValue] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const messagesEndRef = React.useRef<HTMLDivElement | null>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    // Auto-resize textarea based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
        }
    }

    const askCarmah = async (question: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(
                "https://carmah-chatbot-d3hcmxgxq-chawwari-stanfordedus-projects.vercel.app/api/chat",
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

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const MAX_WIDTH = 950
    const MAX_HEIGHT = 500
    const INPUT_CLASS = "carmah-chatbot-input"

    return (
        <div
            style={{
                width: MAX_WIDTH,
                height: MAX_HEIGHT,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                background: "#FCFCFA",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                fontFamily: "Helvetica Neue, sans-serif",
            }}
        >
            <style>{`
        .${INPUT_CLASS}::placeholder {
          color: #ffffff;
          opacity: 0.9;
          font-family: "Helvetica Neue", sans-serif;
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
      `}</style>

            {/* Header */}
            <div
                style={{
                    padding: "20px 16px 10px",
                    background: "#FCFCFA",
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 300,
                    lineHeight: 1.3,
                    color: "#000000",
                    fontFamily: "Helvetica Neue, sans-serif",
                }}
            >
                Ask "Me" a question
            </div>

            {/* Messages */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    background: "#FCFCFA",
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
                                justifyContent: m.isUser
                                    ? "flex-end"
                                    : "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "85%",
                                    padding: m.isUser ? "9px 12px" : "9px 0",
                                    borderRadius: m.isUser ? 14 : 0,
                                    backgroundColor: m.isUser
                                        ? "#F7F7F5"
                                        : "transparent",
                                    color: m.isUser ? "#000000" : "#6b7280",
                                    fontSize: 18,
                                    lineHeight: 1.45,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
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
                                    padding: "9px 0",
                                    backgroundColor: "transparent",
                                    color: "#6b7280",
                                    fontSize: 18,
                                    lineHeight: 1.45,
                                    fontFamily: "Helvetica Neue, sans-serif",
                                }}
                            >
                                Carmah is typing…
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#FCFCFA",
                }}
            >
                <div style={{ padding: "8px 14px 12px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 8,
                            padding: 6,
                            borderRadius: 24,
                            background: "#000000",
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
                            rows={1}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                border: "none",
                                outline: "none",
                                fontSize: 16,
                                background: "transparent",
                                color: "#ffffff",
                                fontFamily: "Helvetica Neue, sans-serif",
                                resize: "none",
                                overflow: "hidden",
                                minHeight: "40px",
                                maxHeight: "120px",
                                lineHeight: 1.4,
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            style={{
                                padding: "10px 14px",
                                backgroundColor: "#000000",
                                color: "white",
                                border: "none",
                                borderRadius: 20,
                                fontSize: 15,
                                fontWeight: 600,
                                cursor:
                                    inputValue.trim() && !isLoading
                                        ? "pointer"
                                        : "not-allowed",
                                transition: "opacity 0.2s ease",
                                opacity:
                                    inputValue.trim() && !isLoading ? 1 : 0.5,
                                fontFamily: "Helvetica Neue, sans-serif",
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

addPropertyControls(Chatbot, {})
