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

async function testWorkingChatbot(query) {
  console.log(`\n🤖 Testing query: "${query}"`);
  console.log("=" * 50);
  
  try {
    // For now, let's get all chunks and use them as context
    // This bypasses the vector search issue
    const { data: chunks, error } = await supabase
      .from("kb_chunks")
      .select("filename, content")
      .limit(5);
    
    if (error) {
      console.error("Database error:", error);
      return;
    }
    
    console.log(`Found ${chunks?.length || 0} chunks from database`);
    
    // Prepare context from all chunks
    const context = chunks
      ?.map((chunk) => `From ${chunk.filename}: ${chunk.content}`)
      .join("\n\n") || "No information available.";

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
  console.log("🚀 Testing Carmah's Portfolio Chatbot (Working Version)");
  console.log("=" * 60);
  
  for (const query of testQueries) {
    await testWorkingChatbot(query);
    console.log("\n" + "-".repeat(60));
  }
  
  console.log("\n✅ All tests completed!");
}

runTests();
