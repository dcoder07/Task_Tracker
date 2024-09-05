import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
});
