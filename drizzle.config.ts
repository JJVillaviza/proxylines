import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/schemas/*",
  out: "./server/database/migration",
  dbCredentials: {
    url: process.env["DATABASE_URL"]!,
  },
});
