import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_EMBED_MODEL = "text-embedding-3-small";
const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

let cachedOpenAI = null;
let cachedSupabase = null;

function getOpenAIClient() {
  if (cachedOpenAI) return cachedOpenAI;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  cachedOpenAI = new OpenAI({ apiKey });
  return cachedOpenAI;
}

function getSupabaseClient() {
  if (cachedSupabase) return cachedSupabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY");
  }
  cachedSupabase = createClient(url, key);
  return cachedSupabase;
}

export async function embedText(text, model = DEFAULT_EMBED_MODEL) {
  const openai = getOpenAIClient();
  const response = await openai.embeddings.create({
    model,
    input: text,
  });
  return response.data[0].embedding;
}

export async function retrieveChunks(
  queryEmbedding,
  { matchCount = 8, similarityThreshold = 0.0 } = {}
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("match_kb", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    similarity_threshold: similarityThreshold,
  });
  if (error) {
    throw new Error(`Supabase match_kb error: ${error.message}`);
  }
  return data || [];
}

async function retrieveFallbackChunks(limit = 8) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("kb_chunks")
    .select("filename, content, id")
    .limit(limit);
  if (error) {
    throw new Error(`Supabase fallback query error: ${error.message}`);
  }
  return data || [];
}

export function buildContextPrompt(chunks) {
  if (!chunks || chunks.length === 0) return "";
  return chunks
    .map((chunk, index) => {
      const label = chunk.filename ? `${chunk.filename}` : `source_${index + 1}`;
      return `Source: ${label}\n${chunk.content}`;
    })
    .join("\n\n");
}

export async function generateRagResponse({
  query,
  systemPrompt,
  context,
  model = DEFAULT_CHAT_MODEL,
}) {
  const openai = getOpenAIClient();
  const prompt = `${systemPrompt}\n\nUse the context below to answer. If the answer is not in the context, say you don't know and ask a clarifying question.\n\nContext:\n${context}`;
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: query },
    ],
    max_tokens: 220,
    temperature: 0.4,
  });
  return completion.choices[0]?.message?.content?.trim() || "";
}

export async function retrieveRelevantContext(query, options = {}) {
  const embedding = await embedText(query);
  const chunks = await retrieveChunks(embedding, options);
  if (!chunks || chunks.length === 0) {
    const fallbackChunks = await retrieveFallbackChunks(
      options.matchCount || 8
    );
    if (!fallbackChunks || fallbackChunks.length === 0) return null;
    const fallbackContext = buildContextPrompt(fallbackChunks);
    return { context: fallbackContext, chunks: fallbackChunks };
  }
  const context = buildContextPrompt(chunks);
  return { context, chunks };
}
