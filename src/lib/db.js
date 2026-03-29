import { Pool } from 'pg';

/**
 * Singleton pg.Pool.
 *
 * Variáveis de ambiente (no .env.local ou no painel do Amplify):
 *
 *   DB_HOST      = bolhatech-prod-postgres.xxxx.us-east-1.rds.amazonaws.com
 *   DB_PORT      = 5432
 *   DB_NAME      = bolhatech
 *   DB_USER      = bolhatech
 *   DB_PASSWORD  = SuaSenha (aceita caracteres especiais sem problema)
 */

let pool;

export function getPool() {
  if (!pool) {
    const host = process.env.DB_HOST;
    const port = parseInt(process.env.DB_PORT || '5432', 10);
    const database = process.env.DB_NAME;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;

    if (!host || !database || !user || !password) {
      throw new Error(
        'Variáveis de banco não configuradas. ' +
        'Defina DB_HOST, DB_NAME, DB_USER e DB_PASSWORD no .env.local.'
      );
    }

    const isLocal = host === 'localhost' || host === '127.0.0.1';

    pool = new Pool({
      host,
      port,
      database,
      user,
      password,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export async function query(text, values) {
  return getPool().query(text, values);
}
