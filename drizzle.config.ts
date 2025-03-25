import { env } from "@/utilities/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/schemas/*",
  out: "./server/database/migration",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
