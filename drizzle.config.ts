import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/database/schema.ts",
  out: "./shared/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});