/**
 * Test script to verify database connection
 * Run with: npx tsx lib/db/test-connection.ts
 */

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env.local" });

async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    console.log("Testing database connection...");
    
    // Create connection
    const connection = neon(process.env.DATABASE_URL);
    const db = drizzle(connection, { schema });
    
    // Simple query to test connection
    const result = await db.execute(sql`SELECT NOW() as current_time`);
    
    console.log("✅ Database connection successful!");
    console.log("Current database time:", result.rows[0]?.current_time);
    
    // Test schema access
    console.log("✅ Schema loaded successfully!");
    console.log("Tables available:", Object.keys(schema));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
