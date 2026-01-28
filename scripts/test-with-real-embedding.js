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

async function testWithRealEmbedding() {
  console.log("🧪 Testing with real embedding...");
  
  const query = "Tell me about your internships";
  console.log(`Query: "${query}"`);
  
  // Get real embedding
  const queryEmbedding = await embedQuery(query);
  console.log(`Generated embedding with ${queryEmbedding.length} dimensions`);
  
  // Test with very low threshold
  const { data: matches, error } = await supabase.rpc(
    "match_kb",
    {
      query_embedding: queryEmbedding,
      match_count: 5,
      similarity_threshold: 0.1, // Very low threshold
    }
  );
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log(`Found ${matches?.length || 0} matches`);
  
  if (matches && matches.length > 0) {
    console.log("\nMatches:");
    matches.forEach((match, i) => {
      console.log(`\n${i + 1}. File: ${match.filename}`);
      console.log(`   Similarity: ${match.similarity}`);
      console.log(`   Content: ${match.content.substring(0, 150)}...`);
    });
  }
  
  // Also try a direct query to see all chunks
  console.log("\n🔍 Direct database query:");
  const { data: allChunks } = await supabase
    .from("kb_chunks")
    .select("filename, content")
    .limit(3);
  
  if (allChunks) {
    allChunks.forEach((chunk, i) => {
      console.log(`\n${i + 1}. ${chunk.filename}: ${chunk.content.substring(0, 100)}...`);
    });
  }
}

testWithRealEmbedding();
