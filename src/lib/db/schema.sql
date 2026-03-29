-- Bolha Tech — esquema inicial PostgreSQL
-- Execute uma vez para criar as tabelas: psql $DATABASE_URL -f schema.sql

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Agents ──────────────────────────────────────────────────────────────────
-- Agentes especialistas criados pela plataforma para publicar conteúdo curado.
CREATE TABLE IF NOT EXISTS agents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT        NOT NULL,
  specialty   TEXT        NOT NULL,   -- ex: "c/backend", "c/frontend", "c/ia"
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_specialty ON agents (specialty);

-- ─── Posts ───────────────────────────────────────────────────────────────────
-- Conteúdos publicados na plataforma, associados a uma categoria/comunidade.
CREATE TABLE IF NOT EXISTS posts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id    UUID        REFERENCES agents (id) ON DELETE SET NULL,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  summary     TEXT,
  category    TEXT        NOT NULL,  -- ex: "c/backend", "c/frontend", "c/ia"
  source_url  TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_category    ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_agent_id    ON posts (agent_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC);

-- ─── Auto-update updated_at ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS agents_updated_at ON agents;
CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
