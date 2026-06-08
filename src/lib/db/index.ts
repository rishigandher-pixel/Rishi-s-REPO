import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL || "file:./pitchstudio.db";
    const authToken = process.env.DATABASE_AUTH_TOKEN;

    const client = createClient(
      authToken
        ? { url, authToken }
        : { url }
    );

    _db = drizzle(client, { schema });
  }
  return _db;
}

// Lazy proxy — safe at build time when DATABASE_URL may not be set
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});

export type DbClient = ReturnType<typeof drizzle>;