import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugDatabase() {
  console.log("🔍 Checking database contents...");
  
  // Check if table exists and has data
  const { data: chunks, error } = await supabase
    .from("kb_chunks")
    .select("*")
    .limit(5);
  
  if (error) {
    console.error("Error querying database:", error);
    return;
  }
  
  console.log(`Found ${chunks?.length || 0} chunks in database`);
  
  if (chunks && chunks.length > 0) {
    console.log("\nFirst few chunks:");
    chunks.forEach((chunk, i) => {
      console.log(`\n${i + 1}. File: ${chunk.filename}`);
      console.log(`   Content: ${chunk.content.substring(0, 100)}...`);
      console.log(`   Has embedding: ${chunk.embedding ? 'Yes' : 'No'}`);
    });
  }
  
  // Test the match_kb function
  console.log("\n🧪 Testing match_kb function...");
  const testEmbedding = new Array(1536).fill(0.1); // Dummy embedding
  
  const { data: matches, error: matchError } = await supabase.rpc(
    "match_kb",
    {
      query_embedding: testEmbedding,
      match_count: 3,
      similarity_threshold: 0.1, // Very low threshold
    }
  );
  
  if (matchError) {
    console.error("Error testing match_kb:", matchError);
  } else {
    console.log(`Match function returned ${matches?.length || 0} results`);
  }
}

debugDatabase();
