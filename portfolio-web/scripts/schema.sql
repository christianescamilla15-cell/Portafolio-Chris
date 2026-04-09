-- Portfolio Intelligence API — Phase 2 Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Portfolio projects (replaces hardcoded kb.js)
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  stack TEXT NOT NULL,
  tests INTEGER,
  demo TEXT,
  github TEXT,
  key_metric TEXT,
  embedding vector(384),
  embedding_es vector(384),
  github_stars INTEGER DEFAULT 0,
  github_last_push TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Portfolio meta (about, skills, experience, contact, availability, metrics)
CREATE TABLE IF NOT EXISTS portfolio_meta (
  key TEXT PRIMARY KEY,
  value_en TEXT NOT NULL,
  value_es TEXT NOT NULL
);

-- 3. Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  visitor_type TEXT,
  query TEXT,
  provider TEXT,
  response_time_ms INTEGER,
  lang TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);

-- 4. Rate limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_ip_time ON rate_limits(ip_hash, created_at DESC);

-- 5. Semantic search RPC function
CREATE OR REPLACE FUNCTION match_projects(
  query_embedding vector(384),
  match_count INTEGER DEFAULT 3,
  match_lang TEXT DEFAULT 'en'
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  description_en TEXT,
  description_es TEXT,
  stack TEXT,
  tests INTEGER,
  demo TEXT,
  github TEXT,
  key_metric TEXT,
  github_stars INTEGER,
  github_last_push TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.name, p.description_en, p.description_es,
    p.stack, p.tests, p.demo, p.github, p.key_metric,
    p.github_stars, p.github_last_push,
    CASE
      WHEN match_lang = 'es' THEN 1 - (p.embedding_es <=> query_embedding)
      ELSE 1 - (p.embedding <=> query_embedding)
    END AS similarity
  FROM portfolio_projects p
  ORDER BY
    CASE
      WHEN match_lang = 'es' THEN p.embedding_es <=> query_embedding
      ELSE p.embedding <=> query_embedding
    END
  LIMIT match_count;
END;
$$;
