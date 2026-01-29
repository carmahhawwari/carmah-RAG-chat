import * as React from "react"

import { addPropertyControls } from "framer"



interface Message {
    id: string
    text: string
    isUser: boolean
    error?: boolean
    retrying?: boolean
}

export default function Chatbot() {

    const [messages, setMessages] = React.useState<Message[]>([

        {

            id: "init",
            text: "Hi! I'm Carmah's AI assistant. Ask me anything about my background, experience, or projects!",
            isUser: false,

        },

    ])

    const [inputValue, setInputValue] = React.useState("")

    const [isLoading, setIsLoading] = React.useState(false)

    const [sessionId] = React.useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

    const scrollRef = React.useRef<HTMLDivElement | null>(null)

    const bottomRef = React.useRef<HTMLDivElement | null>(null)

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const [stickToBottom, setStickToBottom] = React.useState(true)

    const NEAR_BOTTOM_PX = 80



    // Auto-resize textarea based on content

    const adjustTextareaHeight = () => {

        const textarea = textareaRef.current

        if (textarea) {

            textarea.style.height = "auto"

            textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"

        }

    }



    const isNearBottom = () => {

        const el = scrollRef.current

        if (!el) return true

        return (

            el.scrollHeight - el.scrollTop - el.clientHeight <= NEAR_BOTTOM_PX

        )

    }



    const handleScroll = () => {

        setStickToBottom(isNearBottom())

    }



    const hardScrollToBottom = (smooth = false) => {

        const el = scrollRef.current

        if (!el) return

        requestAnimationFrame(() => {

            if (smooth) {

                el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })

            } else {

                el.scrollTop = el.scrollHeight

            }

        })

    }



    React.useLayoutEffect(() => {

        if (stickToBottom) hardScrollToBottom(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [messages.length, isLoading])



    React.useEffect(() => {

        const el = scrollRef.current

        if (!el) return

        const ro = new ResizeObserver(() => {

            if (stickToBottom) hardScrollToBottom(false)

        })

        ro.observe(el)

        return () => {

            ro.disconnect()

        }

    }, [stickToBottom])



    const TITLE_SIZE = 18

    const MSG_SIZE = 13

    const INPUT_CLASS = "carmah-chatbot-input"



    const askCarmah = async (q: string, retryMessageId?: string) => {

        setIsLoading(true)

        try {

            const r = await fetch(

                "https://carmah-rag-chat.vercel.app/api/chat",

                {

                    method: "POST",

                    headers: { "Content-Type": "application/json" },

                    body: JSON.stringify({ query: q, sessionId }),

                }

            )

            if (!r.ok) {

                throw new Error(`HTTP error! status: ${r.status}`)

            }

            const data = await r.json()

            return data.response

        } catch (e) {

            console.error(e)

            // If retrying, mark the message as error

            if (retryMessageId) {

                setMessages(prev => prev.map(msg => 

                    msg.id === retryMessageId 

                        ? { ...msg, error: true, retrying: false }

                        : msg

                ))

            }

            throw e

        } finally {

            setIsLoading(false)

        }

    }



    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!inputValue.trim() || isLoading) return



        const userMessage: Message = { 

            id: `user_${Date.now()}`,

            text: inputValue, 

            isUser: true 

        }

        setMessages((prev) => [...prev, userMessage])

        const question = inputValue

        setInputValue("")



        // Reset textarea height after sending

        if (textareaRef.current) {

            textareaRef.current.style.height = "auto"

        }



        hardScrollToBottom(false)



        try {

            const response = await askCarmah(question)

            const botMessage: Message = { 

                id: `bot_${Date.now()}`,

                text: response, 

                isUser: false 

            }

            setMessages((prev) => [...prev, botMessage])

            if (isNearBottom()) hardScrollToBottom(true)

        } catch (error) {

            // Add error message

            const errorMessage: Message = {

                id: `error_${Date.now()}`,

                text: "Sorry, I'm having trouble connecting. Please try again.",

                isUser: false,

                error: true

            }

            setMessages((prev) => [...prev, errorMessage])

        }

    }



    const handleRetry = async (messageId: string) => {

        // Find the user message that corresponds to this error

        const errorIndex = messages.findIndex(m => m.id === messageId)

        if (errorIndex === -1) return

        

        // Find the previous user message

        let userMessageIndex = -1

        for (let i = errorIndex - 1; i >= 0; i--) {

            if (messages[i].isUser) {

                userMessageIndex = i

                break

            }

        }

        if (userMessageIndex === -1) return



        const userMessage = messages[userMessageIndex]

        

        // Mark as retrying

        setMessages(prev => prev.map(msg => 

            msg.id === messageId 

                ? { ...msg, retrying: true, error: false }

                : msg

        ))



        try {

            const response = await askCarmah(userMessage.text, messageId)

            // Replace error message with successful response

            setMessages(prev => prev.map(msg => 

                msg.id === messageId 

                    ? { ...msg, text: response, error: false, retrying: false }

                    : msg

            ))

            if (isNearBottom()) hardScrollToBottom(true)

        } catch (error) {

            // Keep error state

            setMessages(prev => prev.map(msg => 

                msg.id === messageId 

                    ? { ...msg, retrying: false, error: true }

                    : msg

            ))

        }

    }



    const handleCopy = async (text: string) => {

        try {

            await navigator.clipboard.writeText(text)

            // Visual feedback could be added here

        } catch (err) {

            console.error("Failed to copy:", err)

        }

    }



    const handleClear = () => {

        setMessages([

            {

                id: "init",

                text: "Hi! I'm Carmah's AI assistant. Ask me anything about my background, experience, or projects!",

                isUser: false,

            },

        ])

        setInputValue("")

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

                fontFamily: "'Canela Trial Regular', 'Canela', serif",

                position: "relative",

            }}

        >

            <style>{`

          .cb-chatbot, .cb-chatbot * {

            font-family: 'Canela Trial Regular', 'Canela', serif;

            font-weight: 300;

            -webkit-font-smoothing: antialiased;

            -moz-osx-font-smoothing: grayscale;

          }

          .${INPUT_CLASS}::placeholder {

            color: rgba(0, 0, 0, 0.5);

            font-family: 'Canela Trial Regular', 'Canela', serif;

            font-weight: 300;

          }

          .${INPUT_CLASS} {

            scrollbar-width: thin;

            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

          }

          .${INPUT_CLASS}::-webkit-scrollbar {

            width: 4px;

          }

          .${INPUT_CLASS}::-webkit-scrollbar-thumb {

            background: rgba(0, 0, 0, 0.2);

            border-radius: 2px;

          }

          .fade-top {

            position: sticky;

            top: 0;

            height: 22px;

            margin-bottom: -22px;

            background: linear-gradient(to bottom, #F6F6F4 0%, rgba(246,246,244,0) 100%);

            pointer-events: none;

            z-index: 1;

          }

          .message-actions {

            opacity: 0;

            transition: opacity 0.2s ease;

          }

          .message-container:hover .message-actions {

            opacity: 1;

          }

          .typing-dots {

            display: inline-block;

          }

          .typing-dots span {

            display: inline-block;

            width: 4px;

            height: 4px;

            border-radius: 50%;

            background: rgba(17,24,39,.55);

            margin: 0 2px;

            animation: typing 1.4s infinite;

          }

          .typing-dots span:nth-child(2) {

            animation-delay: 0.2s;

          }

          .typing-dots span:nth-child(3) {

            animation-delay: 0.4s;

          }

          @keyframes typing {

            0%, 60%, 100% {

              transform: translateY(0);

              opacity: 0.5;

            }

            30% {

              transform: translateY(-6px);

              opacity: 1;

            }

          }

        `}</style>



            {/* Clear button - only show if more than initial message */}

            {messages.length > 1 && (

                <button

                    onClick={handleClear}

                    aria-label="Clear conversation"

                    style={{

                        position: "absolute",

                        top: 8,

                        right: 8,

                        padding: "4px 8px",

                        background: "transparent",

                        border: "none",

                        borderRadius: 4,

                        cursor: "pointer",

                        fontSize: 11,

                        color: "rgba(17,24,39,0.6)",

                        fontFamily: "'Canela Trial Regular', 'Canela', serif",

                        fontWeight: 300,

                        letterSpacing: "0.05em",

                        zIndex: 10,

                        transition: "color 0.2s ease",

                    }}

                    onMouseEnter={(e) => e.currentTarget.style.color = "rgba(17,24,39,0.8)"}

                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(17,24,39,0.6)"}

                >

                    Clear

                </button>

            )}



            <div

                style={{

                    padding: "18px 16px 6px",

                    textAlign: "center",

                    fontSize: TITLE_SIZE,

                    lineHeight: 1.25,

                    fontWeight: 300,

                    letterSpacing: "0.05em",

                    color: "#111827",

                }}

            ></div>



            <div

                ref={scrollRef}

                onScroll={handleScroll}

                style={{

                    position: "relative",

                    flex: 1,

                    overflowY: "auto",

                    padding: "4px 16px 0",

                    display: "flex",

                    flexDirection: "column",

                    gap: 12,

                    background: "#F6F6F4",

                }}

            >

                <div className="fade-top" />



                {messages.map((m, i) => {

                    const isUser = m.isUser

                    return (

                        <div

                            key={m.id}

                            className="message-container"

                            style={{

                                display: "flex",

                                flexDirection: "column",

                                alignItems: isUser ? "flex-end" : "flex-start",

                            }}

                        >

                            <div

                                style={{

                                    display: "flex",

                                    alignItems: "center",

                                    gap: 6,

                                    maxWidth: "90%",

                                }}

                            >

                                <div

                                    style={

                                        isUser

                                            ? {

                                                  padding: "10px 14px",

                                                  borderRadius: 14,

                                                  background: "#EAEAE5",

                                                  color: "#1F2937",

                                                  fontSize: MSG_SIZE,

                                                  fontFamily: "'Canela Trial Light', 'Canela', serif",

                                                  fontWeight: 200,

                                                  lineHeight: 1.45,

                                                  letterSpacing: "0.05em",

                                                  whiteSpace: "pre-wrap",

                                                  wordBreak: "break-word",

                                              }

                                            : {

                                                  padding: m.error ? "10px 14px" : "0",

                                                  borderRadius: m.error ? 14 : 0,

                                                  background: m.error ? "#F7F7F5" : "transparent",

                                                  fontSize: MSG_SIZE,

                                                  lineHeight: 1.45,

                                                  color: m.error ? "rgba(239,68,68,0.8)" : "#1F2937",

                                                  fontFamily: "'Canela Trial Regular', 'Canela', serif",

                                                  fontWeight: 300,

                                                  letterSpacing: "0.05em",

                                                  whiteSpace: "pre-wrap",

                                                  wordBreak: "break-word",

                                              }

                                    }

                                >

                                    {m.text}

                                </div>

                                {/* Message actions - copy and retry */}

                                <div className="message-actions" style={{ display: "flex", gap: 4, alignItems: "center" }}>

                                    {!isUser && !m.error && (

                                        <button

                                            onClick={() => handleCopy(m.text)}

                                            aria-label="Copy message"

                                            style={{

                                                padding: "4px 6px",

                                                background: "transparent",

                                                border: "none",

                                                borderRadius: 4,

                                                cursor: "pointer",

                                                display: "flex",

                                                alignItems: "center",

                                                justifyContent: "center",

                                                opacity: 0.6,

                                                transition: "opacity 0.2s ease",

                                            }}

                                            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}

                                            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}

                                        >

                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>

                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>

                                            </svg>

                                        </button>

                                    )}

                                    {m.error && !m.retrying && (

                                        <button

                                            onClick={() => handleRetry(m.id)}

                                            aria-label="Retry message"

                                            style={{

                                                padding: "4px 6px",

                                                background: "transparent",

                                                border: "none",

                                                borderRadius: 4,

                                                cursor: "pointer",

                                                display: "flex",

                                                alignItems: "center",

                                                justifyContent: "center",

                                                opacity: 0.6,

                                                transition: "opacity 0.2s ease",

                                            }}

                                            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}

                                            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}

                                        >

                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                                                <polyline points="23 4 23 10 17 10"></polyline>

                                                <polyline points="1 20 1 14 7 14"></polyline>

                                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>

                                            </svg>

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    )

                })}



                {isLoading && (

                    <div

                        style={{

                            display: "flex",

                            justifyContent: "flex-start",

                        }}

                    >

                        <div

                            style={{

                                padding: "10px 14px",

                                borderRadius: 14,

                                background: "#F7F7F5",

                                color: "rgba(17,24,39,.55)",

                                fontSize: MSG_SIZE,

                                lineHeight: 1.45,

                                fontFamily: "'Canela Trial Regular', 'Canela', serif",

                                fontWeight: 300,

                                letterSpacing: "0.05em",

                            }}

                        >

                            <span className="typing-dots">

                                <span></span>

                                <span></span>

                                <span></span>

                            </span>

                        </div>

                    </div>

                )}



                <div ref={bottomRef} />

            </div>



            <form onSubmit={handleSubmit} style={{ background: "#F6F6F4" }}>

                <div style={{ padding: "12px 16px 16px" }}>

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

                                color: "#111827",

                                fontFamily: "'Canela Trial Regular', 'Canela', serif",

                                fontWeight: 300,

                                letterSpacing: "0.05em",

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

                            aria-label="Send message"

                            style={{

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "center",

                                padding: 10,

                                backgroundColor: "transparent",

                                border: "none",

                                borderRadius: 9999,

                                cursor:

                                    inputValue.trim() && !isLoading

                                        ? "pointer"

                                        : "not-allowed",

                                opacity:

                                    inputValue.trim() && !isLoading ? 1 : 0.5,

                            }}

                        >

                            <svg

                                xmlns="http://www.w3.org/2000/svg"

                                width="18"

                                height="18"

                                fill="black"

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
