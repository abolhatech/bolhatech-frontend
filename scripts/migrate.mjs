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

const host = process.env.DB_HOST;
const port = parseInt(process.env.DB_PORT || '5432', 10);
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

if (!host || !database || !user || !password) {
  console.error('❌  Variáveis de banco não configuradas. Defina DB_HOST, DB_NAME, DB_USER e DB_PASSWORD.');
  process.exit(1);
}

const isLocal = host === 'localhost' || host === '127.0.0.1';

const client = new pg.Client({
  host, port, database, user, password,
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
