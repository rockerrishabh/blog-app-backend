import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as userSchema from "./schemas/user.schema";

const sql = neon(Bun.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema: { ...userSchema },
});
