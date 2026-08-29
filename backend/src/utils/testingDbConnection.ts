import { sql } from "drizzle-orm";
import { db, pool } from "../db/db.js";

const testDbConnection = async () => {
  try {
    const result = await db.execute(sql`SELECT 1 AS connected`);

    console.log("Database connection successful");
    console.log(result.rows);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await pool.end();
  }
};

testDbConnection();
