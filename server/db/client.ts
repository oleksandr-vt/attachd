import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let client: postgres.Sql | null = null

const createDb = () => drizzle(getClient(), { schema })

type Database = ReturnType<typeof createDb>

let dbInstance: Database | null = null

const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL?.trim()

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Add it to your environment before using Postgres-backed result storage.')
  }

  return databaseUrl
}

const getClient = () => {
  if (!client) {
    client = postgres(getDatabaseUrl(), {
      prepare: false,
      max: 5,
    })
  }

  return client
}

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = createDb()
  }

  return dbInstance
}

export const closeDb = async () => {
  if (!client) {
    return
  }

  await client.end()
  client = null
  dbInstance = null
}
