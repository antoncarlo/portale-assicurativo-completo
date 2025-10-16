import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema";

async function seedUsers() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  const demoUsers = [
    {
      id: "user_admin_1",
      username: "admin",
      password: await bcrypt.hash("admin123", 10),
      name: "Amministratore",
      email: "admin@portalebroker.it",
      phone: "+39 333 1234567",
      role: "admin" as const,
      isActive: true,
      commissionRate: 0,
    },
    {
      id: "user_agent_1",
      username: "agente1",
      password: await bcrypt.hash("agente123", 10),
      name: "Mario Rossi",
      email: "mario.rossi@portalebroker.it",
      phone: "+39 333 7654321",
      role: "agent" as const,
      isActive: true,
      commissionRate: 15,
    },
    {
      id: "user_collab_1",
      username: "collab1",
      password: await bcrypt.hash("collab123", 10),
      name: "Laura Bianchi",
      email: "laura.bianchi@portalebroker.it",
      phone: "+39 333 9876543",
      role: "collaborator" as const,
      isActive: true,
      commissionRate: 10,
    },
  ];

  for (const user of demoUsers) {
    try {
      await db.insert(users).values(user);
      console.log(`✅ Utente ${user.username} creato`);
    } catch (error: any) {
      if (error.message?.includes("Duplicate")) {
        console.log(`⚠️  Utente ${user.username} già esistente`);
      } else {
        console.error(`❌ Errore creando ${user.username}:`, error.message);
      }
    }
  }
  
  console.log("✅ Seed utenti completato!");
  process.exit(0);
}

seedUsers().catch(console.error);
