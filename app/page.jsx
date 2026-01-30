"use client";

import * as React from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import ChatDrawer from "./components/ChatDrawer";
import SelectionTooltip from "./components/SelectionTooltip";
import tokens from "../design-tokens.json";

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

const nameLetters = ["C", "a", "r", "m", "a", "h"];

const experience = [
  { year: "2025", role: "Stanford University", detail: "Design + AI" },
  { year: "2025", role: "Apple", detail: "Product Design Intern" },
  { year: "2025", role: "Vectara", detail: "Front End Dev + UX" },
  { year: "2024", role: "PwC", detail: "Consulting Intern" },
];

const projects = [
  {
    title: "Apple",
    label: "Product Design Internship",
    body:
      "Spearheaded the redesign of the Apple Maps App Web for desktop and mobile experiences.",
    height: "320px",
    media: {
      type: "lottie",
      src: "/assets/AppleMaps.json",
      gradient:
        "linear-gradient(180deg, rgba(237, 157, 209, 0.15) 22%, rgba(208, 229, 242, 0.15) 67%)",
    },
  },
  {
    title: "Redefining Navigation",
    label: "Design Consulting",
    body:
      "Enabling short form discovery in CalTrain app through swipe-based discovery feature.",
    height: "580px",
    href: "/calexplore",
    media: {
      type: "video",
      src: "/assets/CalEXPLORE.mp4",
      gradient: "transparent",
      scale: 0.8,
    },
  },
  {
    title: "Guiding users from prompt to product",
    label: "Replit Case Study",
    body:
      "Exploring how to assist users in creating better prompts through in context suggestions and structured prompt scaffolding.",
    height: "280px",
    media: {
      type: "video",
      src: "/assets/Replit_casestudy_lottie.mp4",
      gradient: "transparent",
      fit: "cover",
    },
  },
  {
    title: "Project Title",
    label: "PROJECT LABEL",
    body: "Short description of the project goes here in one or two lines.",
    height: "380px",
  },
];

export default function HomePage() {
  const [appleMapsAnimation, setAppleMapsAnimation] = React.useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [preFillText, setPreFillText] = React.useState("");
  const cursorRef = React.useRef(null);
  const nameContainerRef = React.useRef(null);
  const letterRefs = React.useRef([]);
  const resetTimeoutsRef = React.useRef({});
  const [basePositions, setBasePositions] = React.useState([]);
  const [letterPositions, setLetterPositions] = React.useState([]);
  const [nameSize, setNameSize] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/assets/AppleMaps.json")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setAppleMapsAnimation(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load AppleMaps.json", error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    const handleMouseMove = (event) => {
      cursorEl.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };

    const handleMouseOver = (event) => {
      if (event.target.closest(".brick-media")) {
        document.body.classList.add("cursor-hover");
      }
    };

    const handleMouseOut = (event) => {
      if (event.target.closest(".brick-media")) {
        document.body.classList.remove("cursor-hover");
      }
    };

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);
    document.body.style.cursor = "none";

    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
      document.body.classList.remove("cursor-hover");
      document.body.style.cursor = "";
    };
  }, []);

  React.useEffect(() => {
    const handleOpen = () => setIsDrawerOpen(true);
    window.addEventListener("open-chat-drawer", handleOpen);
    return () => {
      window.removeEventListener("open-chat-drawer", handleOpen);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (!nameContainerRef.current) return;
    if (basePositions.length === nameLetters.length) return;
    const containerRect = nameContainerRef.current.getBoundingClientRect();
    const nodes = letterRefs.current;
    if (nodes.length !== nameLetters.length || nodes.some((node) => !node)) return;
    const positions = nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
      };
    });
    setBasePositions(positions);
    setLetterPositions(positions);
    setNameSize({
      width: containerRect.width,
      height: containerRect.height,
    });
  }, [basePositions.length]);

  React.useEffect(() => {
    return () => {
      Object.values(resetTimeoutsRef.current).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);


  const handleAskAboutSelection = (text) => {
    setPreFillText(text);
    setIsDrawerOpen(true);
  };

  const handleLetterPointerDown = (index) => (event) => {
    event.preventDefault();
    const currentPosition = letterPositions[index] || basePositions[index];
    if (!currentPosition) return;
    if (resetTimeoutsRef.current[index]) {
      clearTimeout(resetTimeoutsRef.current[index]);
      resetTimeoutsRef.current[index] = null;
    }
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = currentPosition.x;
    const originY = currentPosition.y;

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setLetterPositions((prev) => {
        const next = [...prev];
        next[index] = { x: originX + dx, y: originY + dy };
        return next;
      });
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      resetTimeoutsRef.current[index] = window.setTimeout(() => {
        setLetterPositions((prev) => {
          const next = [...prev];
          if (basePositions[index]) {
            next[index] = basePositions[index];
          }
          return next;
        });
        resetTimeoutsRef.current[index] = null;
      }, 120000);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <main
      style={{
        padding: tokens.spacing["80"],
        width: "100%",
        boxSizing: "border-box",
        paddingRight: isDrawerOpen ? `calc(${tokens.spacing["80"]} + 320px)` : tokens.spacing["80"],
        transition: "padding-right 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "500px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            columnGap: "96px",
            alignContent: "center",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1
              style={{
                ...typography.heroHeading,
                color: tokens.colors.primary,
                margin: 0,
              }}
            >
              <span
                ref={nameContainerRef}
                style={{
                  display: "inline-block",
                  position: "relative",
                  width: nameSize ? `${nameSize.width}px` : "auto",
                  height: nameSize ? `${nameSize.height}px` : "auto",
                }}
              >
                {nameLetters.map((letter, index) => {
                  const isReady = basePositions.length === nameLetters.length;
                  const position = letterPositions[index];
                  return (
                    <span
                      key={`${letter}-${index}`}
                      ref={(node) => {
                        letterRefs.current[index] = node;
                      }}
                      onPointerDown={handleLetterPointerDown(index)}
                      style={{
                        position: isReady ? "absolute" : "relative",
                        left: isReady && position ? `${position.x}px` : "auto",
                        top: isReady && position ? `${position.y}px` : "auto",
                        cursor: "grab",
                        userSelect: "none",
                        touchAction: "none",
                      }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </span>
            </h1>

            <div
              style={{
                ...typography.metadata,
                color: tokens.colors.meta,
                marginTop: tokens.spacing["8"],
              }}
            >
              (N.) /KAR-MUH/
            </div>

            <p
              style={{
                ...typography.bodyPrimary,
                color: tokens.colors.primaryBody,
                marginTop: tokens.spacing["16"],
                marginBottom: 0,
                maxWidth: "420px",
              }}
            >
              Design engineer who loves bringing ideas to life. I’m passionate about
              building technology that carries emotion and feels deeply human.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing["8"],
              }}
            >
              {experience.map((entry) => (
                <div
                  key={`${entry.year}-${entry.role}`}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: tokens.spacing["8"],
                  }}
                >
                  <div
                    style={{
                      ...typography.metadata,
                      color: tokens.colors.meta,
                    }}
                  >
                    {entry.year}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: tokens.spacing["8"],
                    }}
                  >
                    <div
                      style={{
                        ...typography.bodyPrimary,
                        color: tokens.colors.primaryBody,
                      }}
                    >
                      {entry.role}
                    </div>
                    {entry.detail ? (
                      <div
                        style={{
                          ...typography.bodyPrimary,
                          color: tokens.colors.tertiary,
                        }}
                      >
                        {entry.detail}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section
          style={{
            marginTop: "150px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              ...typography.metadata,
              color: tokens.colors.meta,
              margin: 0,
            }}
          >
            01 WORK
          </div>
          <div
            style={{
              width: "100%",
              height: "1px",
              background: tokens.colors.dividers,
              marginTop: tokens.spacing["4"],
              marginBottom: tokens.spacing["16"],
            }}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "28px",
            }}
          >
            {[0, 1].map((columnIndex) => (
              <div
                key={`column-${columnIndex}`}
                style={{
                  width: "486px",
                  display: "flex",
                  flexDirection: "column",
                  gap: tokens.spacing["24"],
                }}
              >
                {projects
                  .filter((_, index) => index % 2 === columnIndex)
                  .map((project, index) => (
                    <div key={`${project.title}-${columnIndex}-${index}`}>
                      {project.href ? (
                        <Link href={project.href} style={{ textDecoration: "none" }}>
                          <div
                            className="brick-media"
                            style={{
                              width: "486px",
                              height: project.height,
                              border: "0.5px solid",
                              borderColor: tokens.colors.dividers,
                              background: project.media?.gradient || "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {project.media?.type === "video" ? (
                              <video
                                src={project.media.src}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: project.media?.fit || "contain",
                                  backgroundColor: "transparent",
                                  display: "block",
                                  transform: `scale(${project.media?.scale || 1})`,
                                  transformOrigin: "center",
                                }}
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : null}
                            {project.media?.type === "lottie" && appleMapsAnimation ? (
                              <Lottie
                                animationData={appleMapsAnimation}
                                loop
                                autoplay
                                style={{ width: "100%", height: "100%" }}
                              />
                            ) : null}
                          </div>
                        </Link>
                      ) : (
                        <div
                          className="brick-media"
                          style={{
                            width: "486px",
                            height: project.height,
                            border: "0.5px solid",
                            borderColor: tokens.colors.dividers,
                            background: project.media?.gradient || "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {project.media?.type === "video" ? (
                            <video
                              src={project.media.src}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: project.media?.fit || "contain",
                                backgroundColor: "transparent",
                                display: "block",
                                transform: `scale(${project.media?.scale || 1})`,
                                transformOrigin: "center",
                              }}
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : null}
                          {project.media?.type === "lottie" && appleMapsAnimation ? (
                            <Lottie
                              animationData={appleMapsAnimation}
                              loop
                              autoplay
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : null}
                        </div>
                      )}
                      <div style={{ height: tokens.spacing["16"] }} />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: tokens.spacing["8"],
                        }}
                      >
                        <div
                          style={{
                            ...typography.smallHeading,
                            color: tokens.colors.primaryBody,
                          }}
                        >
                          {project.title}
                        </div>
                        <div
                          style={{
                            ...typography.metadata,
                            color: tokens.colors.meta,
                          }}
                        >
                          {project.label}
                        </div>
                      </div>
                      <div style={{ height: tokens.spacing["8"] }} />
                      <div
                        style={{
                          ...typography.bodyPrimary,
                          color: tokens.colors.primaryBody,
                        }}
                      >
                        {project.body}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </section>
      </div>
      <div ref={cursorRef} className="custom-cursor blur-surface" />
      <SelectionTooltip onAsk={handleAskAboutSelection} />
      <ChatDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        preFillText={preFillText}
        onPrefillConsumed={() => setPreFillText("")}
      />
    </main>
  );
}
