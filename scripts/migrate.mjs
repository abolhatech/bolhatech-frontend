#!/usr/bin/env node
/**
 * Aplica schema e/ou seed no banco PostgreSQL configurado em DATABASE_URL.
 *
 * Uso:
 *   node scripts/migrate.mjs           → aplica schema.sql
 *   node scripts/migrate.mjs seed      → aplica schema.sql + seed.sql
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const withSeed = process.argv.includes('seed');

loadEnvFile(join(__dirname, '../.env.local'));
loadEnvFile(join(__dirname, '../.env'));

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL_NO_SSL ||
  null;

const host = process.env.DB_HOST || process.env.POSTGRES_HOST || process.env.PGHOST;
const port = parseInt(
  process.env.DB_PORT || process.env.POSTGRES_PORT || process.env.PGPORT || '5432',
  10
);
const database = process.env.DB_NAME || process.env.POSTGRES_DATABASE || process.env.PGDATABASE;
const user = process.env.DB_USER || process.env.POSTGRES_USER || process.env.PGUSER;
const password = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD;

if (!connectionString && (!host || !database || !user || !password)) {
  console.error(
    '❌  Variáveis de banco não configuradas. Defina DATABASE_URL ou as variáveis DB_*/POSTGRES_*/PG*.'
  );
  process.exit(1);
}

const isLocal =
  (connectionString && (connectionString.includes('@localhost') || connectionString.includes('@127.0.0.1'))) ||
  host === 'localhost' ||
  host === '127.0.0.1';

const client = connectionString
  ? new pg.Client({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    })
  : new pg.Client({
      host,
      port,
      database,
      user,
      password,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });

try {
  await client.connect();
  console.log('✅  Conectado ao banco.');

  const schema = readFileSync(join(__dirname, '../src/lib/db/schema.sql'), 'utf-8');
  await client.query(schema);
  console.log('✅  Schema aplicado.');

  if (withSeed) {
    const seed = readFileSync(join(__dirname, '../src/lib/db/seed.sql'), 'utf-8');
    await client.query(seed);
    console.log('✅  Seed aplicado.');
  }
} catch (err) {
  console.error('❌  Erro:', err.message);
  process.exit(1);
} finally {
  await client.end();
}

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');

    for (const rawLine of content.split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) continue;

      const key = line.slice(0, separatorIndex).trim();
      if (!key || process.env[key] !== undefined) continue;

      let value = line.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}
