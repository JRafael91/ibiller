import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from "#shared/database/schema";
import postgres from 'postgres'

export { sql, eq, and, or, not, ne, asc, desc } from "drizzle-orm";

export const tables = schema;

export function useDB () {
  const client = postgres(process.env.DATABASE_URL!)
  const db = drizzle({ client, schema });

  return db;
}