import 'dotenv/config';
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Load environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function embedText(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw error;
  }
}

async function chunkText(text, maxChunkSize = 1000) {
  const chunks = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence.trim();
    } else {
      currentChunk += (currentChunk ? ". " : "") + sentence.trim();
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

async function indexKnowledgeBase() {
  try {
    console.log("Starting knowledge base indexing...");
    
    const kbDir = "./kb";
    const files = fs.readdirSync(kbDir).filter(file => file.endsWith(".md"));
    
    console.log(`Found ${files.length} markdown files to process`);
    
    for (const file of files) {
      console.log(`Processing ${file}...`);
      
      const filePath = path.join(kbDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      
      // Remove markdown headers and clean up content
      const cleanContent = content
        .replace(/^#+\s*/gm, "") // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting
        .replace(/\*(.*?)\*/g, "$1") // Remove italic formatting
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove markdown links
        .replace(/\n+/g, " ") // Replace multiple newlines with spaces
        .trim();
      
      // Split into chunks
      const chunks = await chunkText(cleanContent);
      console.log(`Split into ${chunks.length} chunks`);
      
      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
        
        try {
          // Create embedding
          const embedding = await embedText(chunk);
          
          // Insert into Supabase
          const { error } = await supabase
            .from("kb_chunks")
            .insert({
              filename: file,
              content: chunk,
              embedding: embedding
            });
          
          if (error) {
            console.error(`Error inserting chunk ${i + 1} of ${file}:`, error);
          } else {
            console.log(`✓ Inserted chunk ${i + 1} of ${file}`);
          }
        } catch (error) {
          console.error(`Error processing chunk ${i + 1} of ${file}:`, error);
        }
      }
    }
    
    console.log("Knowledge base indexing completed!");
    
  } catch (error) {
    console.error("Error during indexing:", error);
    process.exit(1);
  }
}

// Run the indexing
indexKnowledgeBase();
