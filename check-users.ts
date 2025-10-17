import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema";

async function checkUsers() {
  const db = drizzle(process.env.DATABASE_URL!);
  const allUsers = await db.select().from(users);
  
  console.log(`\n👥 Utenti nel database: ${allUsers.length}\n`);
  
  allUsers.forEach(u => {
    console.log(`  ${u.role.toUpperCase().padEnd(15)} | ${u.username.padEnd(20)} | ${u.name || 'N/A'}`);
  });
  
  if (allUsers.length === 0) {
    console.log('\n⚠️  Nessun utente trovato! Devo creare gli utenti demo.\n');
  }
}

checkUsers();
