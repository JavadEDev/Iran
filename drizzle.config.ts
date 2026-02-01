import type { Config } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables for drizzle-kit CLI
config({ path: ".env.local" });

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
