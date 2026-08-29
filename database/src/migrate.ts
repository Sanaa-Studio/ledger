import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index.js";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("Migrations completed");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

main();
