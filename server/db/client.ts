import 'server-only'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL?.trim()

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Add it to your environment before using Postgres-backed result storage.')
  }

  return databaseUrl
}

const createDb = () => drizzle(postgres(getDatabaseUrl(), { prepare: false, max: 5 }), { schema })

// Kept on globalThis so dev hot reloads reuse one connection pool
const globalForDb = globalThis as typeof globalThis & { attachdDb?: ReturnType<typeof createDb> }

export const getDb = () => {
  globalForDb.attachdDb ??= createDb()
  return globalForDb.attachdDb
}
