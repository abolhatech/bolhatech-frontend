-- Bolha Tech — esquema inicial PostgreSQL
-- Execute uma vez para criar as tabelas: psql $DATABASE_URL -f schema.sql

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Agents ──────────────────────────────────────────────────────────────────
-- Agentes especialistas criados pela plataforma para publicar conteúdo curado.
CREATE TABLE IF NOT EXISTS agents (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  specialty     TEXT        NOT NULL,   -- ex: "c/backend", "c/frontend", "c/ia"
  system_prompt TEXT,                   -- prompt completo de identidade e comportamento do agente
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_specialty ON agents (specialty);

-- Adiciona system_prompt caso a coluna ainda não exista (migração segura)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'system_prompt'
  ) THEN
    ALTER TABLE agents ADD COLUMN system_prompt TEXT;
  END IF;
END;
$$;

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

-- ─── Newsletter ──────────────────────────────────────────────────────────────
-- Captura de emails para os envios editoriais diários da Margaret.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL,
  source        TEXT        NOT NULL DEFAULT 'site',
  agent_name    TEXT        NOT NULL DEFAULT 'Margaret',
  status        TEXT        NOT NULL DEFAULT 'active',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email),
  CONSTRAINT newsletter_subscribers_status_check CHECK (status IN ('active', 'unsubscribed'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status
  ON newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at
  ON newsletter_subscribers (subscribed_at DESC);

-- ─── Margaret Daily Digest ───────────────────────────────────────────────────
-- Auditoria e rastreabilidade do pipeline diário que lê RSS, seleciona pautas
-- e publica um novo post da Margaret.
CREATE TABLE IF NOT EXISTS news_digest_runs (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id           UUID        REFERENCES agents (id) ON DELETE SET NULL,
  run_key            TEXT        NOT NULL,
  run_date           DATE        NOT NULL,
  status             TEXT        NOT NULL DEFAULT 'pending',
  model              TEXT,
  items_collected    INTEGER     NOT NULL DEFAULT 0,
  items_shortlisted  INTEGER     NOT NULL DEFAULT 0,
  items_selected     INTEGER     NOT NULL DEFAULT 0,
  title              TEXT,
  summary            TEXT,
  dominant_theme     TEXT,
  audit_json         JSONB,
  output_json        JSONB,
  created_post_id    UUID        REFERENCES posts (id) ON DELETE SET NULL,
  error_message      TEXT,
  started_at         TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT news_digest_runs_run_key_unique UNIQUE (run_key),
  CONSTRAINT news_digest_runs_status_check CHECK (
    status IN ('pending', 'running', 'completed', 'completed_noop', 'failed')
  )
);

CREATE INDEX IF NOT EXISTS idx_news_digest_runs_run_date
  ON news_digest_runs (run_date DESC);

CREATE TABLE IF NOT EXISTS news_digest_run_items (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id             UUID        NOT NULL REFERENCES news_digest_runs (id) ON DELETE CASCADE,
  url                TEXT        NOT NULL,
  title              TEXT        NOT NULL,
  source             TEXT        NOT NULL,
  source_label       TEXT        NOT NULL,
  summary            TEXT,
  published_at       TIMESTAMPTZ,
  score              NUMERIC(10, 2),
  rank_position      INTEGER,
  selection_reason   TEXT,
  raw_item_json      JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT news_digest_run_items_run_url_unique UNIQUE (run_id, url)
);

CREATE INDEX IF NOT EXISTS idx_news_digest_run_items_run_id
  ON news_digest_run_items (run_id);

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

DROP TRIGGER IF EXISTS news_digest_runs_updated_at ON news_digest_runs;
CREATE TRIGGER news_digest_runs_updated_at
  BEFORE UPDATE ON news_digest_runs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
