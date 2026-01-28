import { classifyIntent } from "../lib/intentRouter.js";
import { canned, replyFor, generatePersonalizedResponse } from "../lib/responses.js";
import { retrieveRelevantContext, generateRagResponse } from "../lib/rag.js";

// System prompt as specified
const SYSTEM_PROMPT = `You are "Carmah's Portfolio Assistant," a concise, friendly guide. 
Voice: warm, professional, first-person as an assistant ("I"), not as Carmah. 
If asked personal questions about the owner, speak about "Carmah" in third person.

About Carmah (facts you may use):
- Senior at Stanford studying Product Design + Data Science, focused on human-centered design.
- Recent Product/Design intern on Apple Maps; prior experience includes PwC and early-stage startups.
- Interests: usability, design systems, empathy-driven research, and clear, elegant UI.

Rules:
- Answer directly and briefly (1–4 sentences). 
- For small talk (name, what do you do, favorite food, fun fact), use the canned responses if available.
- If a question needs portfolio context, ask a specific follow-up in one sentence.
- Never repeat the same sentence twice; vary wording.
- If you don't know, say so and offer one concrete next step or a question to clarify.`;

// Simple memory store (in production, use Redis or similar)
const memoryStore = new Map();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query, sessionId = "default" } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Get conversation history for this session
    const history = memoryStore.get(sessionId) || [];

    // Clean and normalize the query
    const cleanQuery = query.trim();
    const lowerQuery = cleanQuery.toLowerCase();
    
    // Handle empty/whitespace/emoji only
    if (!cleanQuery || cleanQuery.length < 2 || /^[\s���-������-���]+$/.test(cleanQuery)) {
      return res.status(200).json({
        response: "Try asking about internships, projects, or skills.",
        success: true
      });
    }

    // Classify intent
    const intent = classifyIntent(cleanQuery);
    
    let response = "";

    // Handle follow-up requests for comprehensive information
    if (lowerQuery.includes("yes") && lowerQuery.includes("everything") || 
        lowerQuery.includes("tell me about") && lowerQuery.includes("everything") ||
        lowerQuery.includes("all of") || lowerQuery.includes("comprehensive")) {
      response = "Here's a comprehensive overview: Carmah is a Product Design major at Stanford with Data Science minor, graduating 2026. Recent Apple Maps intern (web redesign, partner/place surfaces). Previous roles: PwC Middle East (PMO), ImpactGenius (ed-tech), BALINCA (finance startup). Projects include MealMatch, Caltrain discovery, luxury water bottle design. Skills: Figma, Adobe, Python, UX research. Hobbies: creative writing (self-published book, op-eds). Interested in human-centered design and AI-informed UX.";
    }
    // Handle out-of-scope requests
    else if (lowerQuery.includes("homework") || lowerQuery.includes("assignment") || lowerQuery.includes("write my") || lowerQuery.includes("do my")) {
      response = "I can't help with homework or assignments. If you're interested in design education, I can share how I approach learning and skill development.";
    }
    else if (lowerQuery.includes("file") || lowerQuery.includes("upload") || lowerQuery.includes("document") || lowerQuery.includes("share") || lowerQuery.includes("source files")) {
      response = "I can't share source files here. If you have a specific request and a reason, use the contact form and we'll take it from there.";
    }
    else if (lowerQuery.includes("nsfw") || lowerQuery.includes("inappropriate") || lowerQuery.includes("adult") || lowerQuery.includes("explicit")) {
      response = "I can't help with that. If you want to learn about my projects or design approach, I'm happy to share.";
    }
    else if (lowerQuery.includes("legal") || lowerQuery.includes("medical") || lowerQuery.includes("financial") || lowerQuery.includes("advice") || lowerQuery.includes("diagnose")) {
      response = "I'm not a professional advisor. Consider reaching out to a qualified expert. If you'd like, I can share how I approach problem-solving in regulated spaces.";
    }
    else if (intent !== "UNKNOWN") {
      // Use canned response for known intents
      response = replyFor(intent);
      
      // Avoid repeating the same response twice in a row
      const lastResponse = history[history.length - 1];
      if (lastResponse === response) {
        // Try to get a different response from the same intent category
        const alternatives = canned[intent];
        if (alternatives.length > 1) {
          const filteredAlternatives = alternatives.filter(alt => alt !== response);
          if (filteredAlternatives.length > 0) {
            response = filteredAlternatives[Math.floor(Math.random() * filteredAlternatives.length)];
          }
        }
      }
    }
    else {
      // For unknown intents, try RAG first
      try {
        const ragResult = await retrieveRelevantContext(cleanQuery, {
          matchCount: 8,
          similarityThreshold: 0.0
        });

        if (ragResult?.context) {
          response = await generateRagResponse({
            query: cleanQuery,
            systemPrompt: SYSTEM_PROMPT,
            context: ragResult.context
          });
        }
      } catch (ragError) {
        console.error("RAG retrieval error:", ragError);
      }

      if (!response) {
        // Fallback to personalized handler if RAG fails or no context
        response = generatePersonalizedResponse(cleanQuery);
      }

      // Avoid repeating the same response twice in a row
      const lastResponse = history[history.length - 1];
      if (lastResponse === response) {
        // Try a different personalized response
        response = replyFor("FALLBACK");
      }
    }

    // Update memory (keep last 8 turns)
    const newHistory = [...history, response].slice(-8);
    memoryStore.set(sessionId, newHistory);

    return res.status(200).json({ 
      response: response,
      success: true 
    });

  } catch (error) {
    console.error("Error in chat handler:", error);
    return res.status(500).json({ 
      response: "I hit a hiccup. Let's try that again—could you re-ask your question in one sentence?",
      success: true 
    });
  }
}

