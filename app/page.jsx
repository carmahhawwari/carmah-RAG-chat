"use client";

import * as React from "react";
import Lottie from "lottie-react";
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
    media: {
      type: "video",
      src: "/assets/CalEXPLORE.mp4",
      gradient: "transparent",
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

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleAskAboutSelection = (text) => {
    setPreFillText(`Tell me more about: ${text}`);
    setIsDrawerOpen(true);
  };

  return (
    <main
      style={{
        padding: tokens.spacing["80"],
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: tokens.spacing["24"],
        }}
      >
        <button
          type="button"
          aria-label="Toggle chatbot drawer"
          onClick={handleOpenDrawer}
          style={{
            background: "transparent",
            border: "0.5px solid",
            borderColor: tokens.colors.dividers,
            borderRadius: tokens.radius.pill,
            padding: `${tokens.spacing["8"]} ${tokens.spacing["12"]}`,
            cursor: "pointer",
            ...typography.metadata,
            color: tokens.colors.meta,
          }}
        >
          Chat
        </button>
      </header>
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
              Carmah
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
              justifyContent: "center",
            }}
          >
            {[0, 1].map((columnIndex) => (
              <div
                key={`column-${columnIndex}`}
                style={{
                  width: "450px",
                  display: "flex",
                  flexDirection: "column",
                  gap: tokens.spacing["24"],
                }}
              >
                {projects
                  .filter((_, index) => index % 2 === columnIndex)
                  .map((project, index) => (
                    <div key={`${project.title}-${columnIndex}-${index}`}>
                      <div
                        style={{
                          width: "450px",
                          height: project.height,
                          border: "0.5px solid",
                          borderColor: tokens.colors.dividers,
                          background: project.media?.gradient || "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
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
