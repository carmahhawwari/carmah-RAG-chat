import { retrieveRelevantContext, generateRagResponse } from "../lib/rag.js";

const SYSTEM_PROMPT = `You are "Carmah's Portfolio Assistant," a concise, friendly guide.
Voice: warm, professional, first-person as an assistant ("I"), not as Carmah.
If asked personal questions about the owner, speak about "Carmah" in third person.`;

const TEST_QUERIES = [
  "What internships has Carmah done?",
  "Tell me about MealMatch.",
  "What is Carmah's design philosophy?",
  "How can I contact Carmah?",
  "What does Carmah do for fun?",
];

async function run() {
  for (const query of TEST_QUERIES) {
    console.log(`\nQuery: ${query}`);
    const ragResult = await retrieveRelevantContext(query, {
      matchCount: 8,
      similarityThreshold: 0.0,
    });

    if (!ragResult?.context) {
      console.log("No context retrieved.");
      continue;
    }

    const response = await generateRagResponse({
      query,
      systemPrompt: SYSTEM_PROMPT,
      context: ragResult.context,
    });

    console.log("Response:");
    console.log(response);
  }
}

run().catch((err) => {
  console.error("RAG test failed:", err.message);
  process.exit(1);
});
