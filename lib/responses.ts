const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const canned = {
  GREET: [
    "Hi! I'm Carmah's portfolio assistant—how can I help?",
    "Hello! Happy to help you explore Carmah's work. What would you like to see?"
  ],
  NAME: [
    "I'm Carmah's portfolio assistant. Carmah is the designer—want a quick overview?",
    "I go by the portfolio assistant. Carmah's the human behind the work!"
  ],
  WHAT_DO_YOU_DO: [
    "I answer questions about Carmah's work, studies, and process—and point you to relevant projects.",
    "I'm here to guide you through Carmah's projects, experience, and design approach."
  ],
  FOOD: [
    "I don't eat, but Carmah loves Mediterranean flavors and good coffee.",
    "No taste buds here—Carmah's go-tos are Mediterranean dishes and a solid latte."
  ],
  FUN_FACT: [
    "Fun fact: Carmah is obsessed with usability and even studies how small UI details change behavior.",
    "Fun fact: Carmah once redesigned a transit discovery flow to make spontaneous exploration easier."
  ],
  PROJECTS: [
    "Looking for projects? Try the CalExplore navigation feature or the Apple Maps work. Want links?",
    "Two highlights: CalExplore discovery flow and Apple Maps redesign work. Should I open one?"
  ],
  EXPERIENCE: [
    "Recent: Apple Maps product/design. Before that: PwC and startup roles. Want a 2-line summary?",
    "Apple Maps intern recently; earlier roles at PwC and startups. Interested in specifics?"
  ],
  SKILLS: [
    "Skills: product design, UX research, design systems; tools: Figma, Adobe, Python. Want details?",
    "Core: human-centered design + data-informed decisions; comfortable in Figma and Python."
  ],
  CONTACT: [
    "Want to connect? I can share an email or open the contact section—what do you prefer?",
    "Happy to connect you—should I reveal the contact link or draft a short intro?"
  ],
  FALLBACK: [
    "I'm not sure I followed—do you want projects, experience, or contact info?",
    "Could you clarify? I can help with projects, experience, skills, or getting in touch."
  ]
};

export function replyFor(intent: keyof typeof canned) {
  return pick(canned[intent]);
}

