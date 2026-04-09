-- Migrate embeddings from 384d to 512d (Voyage AI uses 512 dimensions)

-- Drop existing columns and recreate with correct dimensions
ALTER TABLE portfolio_projects DROP COLUMN IF EXISTS embedding;
ALTER TABLE portfolio_projects DROP COLUMN IF EXISTS embedding_es;
ALTER TABLE portfolio_projects ADD COLUMN embedding vector(512);
ALTER TABLE portfolio_projects ADD COLUMN embedding_es vector(512);

-- Update the match_projects function for 512d
CREATE OR REPLACE FUNCTION match_projects(
  query_embedding vector(512),
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
