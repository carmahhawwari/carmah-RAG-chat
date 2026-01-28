const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

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
  ABOUT: [
    "Carmah is a Product Design major at Stanford with a Data Science minor, graduating in 2026. She's passionate about creating human-centered, emotionally resonant interfaces and has interned at Apple Maps working on web redesign. She brings a unique cross-cultural perspective from growing up in Saudi Arabia and now studying in the US.",
    "Carmah is a designer who believes in the power of thoughtful, empathetic design. She's currently at Stanford studying Product Design with a Data Science minor, and she's interned at companies like Apple Maps and PwC. Her work focuses on making technology feel more human and accessible.",
    "Meet Carmah—a Stanford Product Design student with a Data Science minor, graduating in 2026. She's worked on everything from Apple Maps redesigns to ed-tech startups, always with a focus on human-centered design. She's also a creative writer who's self-published a book and written op-eds."
  ],
  PERSONAL: [
    "Carmah's really driven by empathy—she loves design that feels warm, human, and intentional. She's passionate about the intersection of art and technology, especially when it connects to human emotion.",
    "She's inspired by vulnerability and emotion—Carmah believes design should speak to both heart and mind. She loves exploring how people feel and interact with the world around them.",
    "Carmah's personality is a beautiful blend of analytical thinking and creative intuition. She's curious about human behavior and loves creating experiences that make people feel understood and supported."
  ],
  DESIGN_PHILOSOPHY: [
    "Carmah's design approach centers around empathy, sensory engagement, and purposeful functionality. She believes great design should feel intuitive and emotionally resonant.",
    "Her design philosophy is all about human connection—she creates interfaces that feel warm and supportive, not just functional. She's inspired by how small details can create big emotional impacts.",
    "Carmah designs with intention, focusing on how people feel when they interact with her work. She's passionate about creating digital experiences that feel as thoughtful as physical ones."
  ],
  FOOD: [
    "I don't eat, but Carmah loves Mediterranean flavors and good coffee.",
    "No taste buds here—Carmah's go-tos are Mediterranean dishes and a solid latte."
  ],
  FUN_FACT: [
    "Fun fact: Carmah is obsessed with usability and even studies how small UI details change behavior.",
    "Fun fact: Carmah once redesigned a transit discovery flow to make spontaneous exploration easier.",
    "Fun fact: Carmah can juggle and walk on her hands! She says it's a good reminder that balance and focus show up in both play and design.",
    "Fun fact: Carmah used to coach younger swimmers, which taught her patience and adaptive communication—skills she brings to user research."
  ],
  HOBBIES: [
    "Carmah enjoys creative writing—she's self-published a book and written op-eds for major outlets. Writing sharpens her observation skills and storytelling abilities.",
    "Creative writing is a big passion. Carmah has self-published a book and written op-eds, which helps her approach user research and product storytelling."
  ],
  PROJECTS: [
    "Looking for projects? Try the CalExplore navigation feature or the Apple Maps work. Want links?",
    "Two highlights: CalExplore discovery flow and Apple Maps redesign work. Should I open one?"
  ],
  EXPERIENCE: [
    "Recent: Apple Maps product/design. Before that: PwC and startup roles. Want a 2-line summary?",
    "Apple Maps intern recently; earlier roles at PwC and startups. Interested in specifics?",
    "Carmah's experience spans Apple Maps (product design intern), PwC Middle East (PMO support), ImpactGenius (ed-tech ops), and BALINCA (finance startup design). Each role focused on different aspects of product development and user experience."
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
    "That's a lovely question—Carmah's inspirations come from how humans feel and interact with the world around them. She's passionate about creating design that feels both thoughtful and emotionally resonant.",
    "Carmah's really driven by empathy and human connection in her work. She loves exploring the intersection of art, technology, and emotion to create meaningful experiences.",
    "She's inspired by vulnerability and the small moments that make technology feel more human. Carmah believes great design should speak to both heart and mind.",
    "Carmah's approach to design is deeply rooted in understanding people—she creates experiences that feel warm, intentional, and supportive of human needs and emotions."
  ]
};

export function replyFor(intent) {
  return pick(canned[intent]);
}

// Personalized fallback handler for open-ended queries
export function generatePersonalizedResponse(query) {
  const q = query.toLowerCase();
  
  // Context about Carmah for personalized responses
  const carmahContext = {
    personality: ["empathetic", "creative", "analytical", "curious", "thoughtful"],
    interests: ["human-centered design", "emotional connection", "art and technology", "creative writing", "traveling"],
    philosophy: ["empathy-driven design", "sensory engagement", "purposeful functionality", "human emotion"],
    experience: ["Apple Maps", "PwC", "Vectara", "ImpactGenius", "Stanford"],
    style: ["warm", "intentional", "supportive", "emotionally resonant"]
  };

  // Generate contextual responses based on query patterns
  if (q.includes("like") || q.includes("love") || q.includes("enjoy")) {
    return "Carmah loves art, design thinking, and exploring how emotions shape digital experiences. She's passionate about the intersection of creativity and technology.";
  }
  
  if (q.includes("inspire") || q.includes("motivate") || q.includes("drive")) {
    return "Carmah's inspired by vulnerability and emotion—she believes design should speak to both heart and mind, creating experiences that feel genuinely human.";
  }
  
  if (q.includes("personality") || q.includes("character") || q.includes("style")) {
    return "Carmah's personality is a beautiful blend of analytical thinking and creative intuition. She's curious about human behavior and loves creating experiences that make people feel understood.";
  }
  
  if (q.includes("design") || q.includes("approach") || q.includes("process")) {
    return "Carmah's design approach centers around empathy and human connection. She creates interfaces that feel warm and supportive, focusing on how people feel when they interact with her work.";
  }
  
  if (q.includes("background") || q.includes("story") || q.includes("journey")) {
    return "Carmah's journey is shaped by her cross-cultural perspective—growing up in Saudi Arabia and now studying at Stanford. This unique background informs her empathetic approach to design.";
  }
  
  // Default personalized response
  return "That's a lovely question—Carmah's inspirations come from how humans feel and interact with the world around them. She's passionate about creating design that feels both thoughtful and emotionally resonant.";
}

