import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@localhost:5432/placeholder'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl,
  },
})
