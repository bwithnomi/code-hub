import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
  // Keep connections alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Enhanced error handling
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client:', err);
  // Don't exit the process, just log the error
});

pool.on('connect', () => {
  console.log('✅ New database connection established');
});

pool.on('remove', () => {
  console.log('ℹ️  Database connection removed from pool');
});

export const db = drizzle(pool, {schema});

/**
 * Simple wrapper for database operations.
 * The connection pool handles reconnection automatically, so we just execute the operation.
 * This maintains backward compatibility with existing code while removing unnecessary overhead.
 * 
 * @param operation - The database operation to execute
 * @returns The result of the operation
 */
export async function ensureConnection<T>(
  operation: () => Promise<T>
): Promise<T> {
  // The connection pool handles reconnection automatically.
  // Just execute the operation - if there's a connection issue, the pool will handle it.
  return await operation();
}
