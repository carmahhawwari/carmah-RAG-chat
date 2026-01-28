import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const EMBED_MODEL = "text-embedding-3-small";
const KB_DIR = path.join(process.cwd(), "kb");
const CONTENT_DIR = path.join(process.cwd(), "content");
const CHUNK_WORDS = 700;
const OVERLAP_WORDS = 120;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function cleanMarkdown(text) {
  return text
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

function chunkByWords(text, size = CHUNK_WORDS, overlap = OVERLAP_WORDS) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    const slice = words.slice(i, i + size);
    if (slice.length === 0) break;
    chunks.push(slice.join(" "));
  }
  return chunks;
}

async function embedBatch(texts) {
  const response = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

async function listMarkdownFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return listMarkdownFiles(fullPath);
        }
        if (entry.isFile() && entry.name.endsWith(".md")) {
          return [fullPath];
        }
        return [];
      })
    );
    return files.flat();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function ingest({ reset = false } = {}) {
  if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing OPENAI_API_KEY, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY");
  }

  if (reset) {
    const { error } = await supabase.from("kb_chunks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      throw new Error(`Failed to clear kb_chunks: ${error.message}`);
    }
  }

  const kbFiles = await listMarkdownFiles(KB_DIR);
  const contentFiles = await listMarkdownFiles(CONTENT_DIR);
  const files = [...kbFiles, ...contentFiles];

  if (files.length === 0) {
    console.log("No markdown files found in kb/ or content/");
    return;
  }

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const cleaned = cleanMarkdown(raw);
    const chunks = chunkByWords(cleaned);
    const relativeName = path.relative(process.cwd(), file);

    for (let i = 0; i < chunks.length; i += 20) {
      const batch = chunks.slice(i, i + 20);
      const embeddings = await embedBatch(batch);
      const rows = batch.map((content, index) => ({
        filename: relativeName,
        content,
        embedding: embeddings[index],
      }));

      const { error } = await supabase.from("kb_chunks").insert(rows);
      if (error) {
        throw new Error(`Insert failed for ${relativeName}: ${error.message}`);
      }
      console.log(`Inserted ${rows.length} chunks from ${relativeName}`);
    }
  }
}

const shouldReset = process.argv.includes("--reset");
ingest({ reset: shouldReset }).catch((err) => {
  console.error("Ingestion failed:", err.message);
  process.exit(1);
});
