import type { Config } from "drizzle-kit";

export default {
  schema: "./src/app/server/schema.ts",
  out: "./src/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
