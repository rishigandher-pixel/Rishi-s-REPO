import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// For local development, use a local SQLite file
// For production, use Turso's remote database
const url = process.env.DATABASE_URL || "file:./pitchstudio.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient(
  authToken
    ? { url, authToken }
    : { url }
);

export const db = drizzle(client, { schema });
export type DbClient = typeof db;