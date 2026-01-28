import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function embedQuery(query) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  return response.data[0].embedding;
}

async function testChatbot(query) {
  console.log(`\n🤖 Testing query: "${query}"`);
  console.log("=" * 50);
  
  try {
    // Create embedding for the query
    const queryEmbedding = await embedQuery(query);

    // Search for relevant chunks
    const { data: chunks, error: searchError } = await supabase.rpc(
      "match_kb",
      {
        query_embedding: queryEmbedding,
        match_count: 3,
        similarity_threshold: 0.7,
      }
    );

    if (searchError) {
      console.error("Search error:", searchError);
      return;
    }

    console.log(`Found ${chunks?.length || 0} relevant chunks`);
    
    // Prepare context
    const context = chunks
      ?.map((chunk) => chunk.content)
      .join("\n\n") || "No relevant information found.";

    // Create the system prompt
    const systemPrompt = `You are Carmah Hawwari's portfolio concierge. Answer questions about Carmah in first person ("I", "my", "me"). Keep responses concise (≤5 sentences) and conversational. Use the provided context to answer accurately.

Context: ${context}`;

    // Generate response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    console.log("🤖 Carmah's Response:");
    console.log(completion.choices[0].message.content);
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Test queries
const testQueries = [
  "Tell me about yourself",
  "What internships have you done?",
  "What is your design philosophy?",
  "How can I contact you?",
  "What's your favorite Apple product?"
];

async function runTests() {
  console.log("🚀 Testing Carmah's Portfolio Chatbot");
  console.log("=" * 50);
  
  for (const query of testQueries) {
    await testChatbot(query);
    console.log("\n" + "-".repeat(50));
  }
  
  console.log("\n✅ All tests completed!");
}

runTests();
