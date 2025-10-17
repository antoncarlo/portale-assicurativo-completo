import { drizzle } from "drizzle-orm/mysql2";
import { productTypes } from "./drizzle/schema";

async function check() {
  const db = drizzle(process.env.DATABASE_URL!);
  const products = await db.select().from(productTypes);
  console.log(JSON.stringify(products, null, 2));
}
check();
