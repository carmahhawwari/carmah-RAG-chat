-- Supabase Setup for Carmah Chatbot
-- Run these commands in your Supabase SQL editor

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the knowledge base chunks table
CREATE TABLE IF NOT EXISTS kb_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for vector similarity search
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx ON kb_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create the RPC function for matching knowledge base chunks
CREATE OR REPLACE FUNCTION match_kb(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  filename TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE SQL
AS $$
  SELECT
    kb_chunks.id,
    kb_chunks.filename,
    kb_chunks.content,
    1 - (kb_chunks.embedding <=> query_embedding) AS similarity
  FROM kb_chunks
  WHERE 1 - (kb_chunks.embedding <=> query_embedding) > similarity_threshold
  ORDER BY kb_chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE kb_chunks TO anon;
GRANT ALL ON TABLE kb_chunks TO authenticated;
GRANT EXECUTE ON FUNCTION match_kb TO anon;
GRANT EXECUTE ON FUNCTION match_kb TO authenticated;
