import { Pool } from 'pg';

/**
 * Singleton pg.Pool.
 *
 * Variáveis de ambiente suportadas:
 *
 *   DATABASE_URL = postgresql://...
 *
 * Variáveis automáticas da Vercel/Neon:
 *   DATABASE_URL / DATABASE_URL_UNPOOLED
 *   POSTGRES_URL / POSTGRES_URL_NON_POOLING / POSTGRES_URL_NO_SSL
 *   PGHOST / PGDATABASE / PGUSER / PGPASSWORD
 *
 * Fallback legado:
 *   DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD
 *   PGHOST / PGDATABASE / PGUSER / PGPASSWORD
 */

let pool;

export function getPool() {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_URL_NO_SSL ||
      null;

    if (connectionString) {
      const isLocal =
        connectionString.includes('@localhost') ||
        connectionString.includes('@127.0.0.1');

      pool = new Pool({
        connectionString,
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
      });
    } else {
      const host = process.env.DB_HOST || process.env.POSTGRES_HOST || process.env.PGHOST;
      const port = parseInt(
        process.env.DB_PORT || process.env.POSTGRES_PORT || process.env.PGPORT || '5432',
        10
      );
      const database = process.env.DB_NAME || process.env.POSTGRES_DATABASE || process.env.PGDATABASE;
      const user = process.env.DB_USER || process.env.POSTGRES_USER || process.env.PGUSER;
      const password =
        process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD;

      if (!host || !database || !user || !password) {
        throw new Error(
          'Variáveis de banco não configuradas. ' +
            'Defina DATABASE_URL ou as variáveis DB_*/POSTGRES_*/PG* no .env.local.'
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
  }

  return pool;
}

export async function query(text, values) {
  return getPool().query(text, values);
}
