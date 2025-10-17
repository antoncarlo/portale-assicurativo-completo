import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema";

async function createDemoUsers() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  console.log("🔧 Creazione utenti demo...\n");
  
  const demoUsers = [
    {
      id: "user_master_1",
      username: "master",
      password: await bcrypt.hash("master123", 10),
      name: "Master Admin",
      email: "master@portalebroker.it",
      phone: "+39 333 1111111",
      role: "master" as const,
      isActive: true,
      commissionRate: 0,
    },
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
      username: "agente",
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
      username: "collaboratore",
      password: await bcrypt.hash("collaboratore123", 10),
      name: "Laura Bianchi",
      email: "laura.bianchi@portalebroker.it",
      phone: "+39 333 9876543",
      role: "collaborator" as const,
      isActive: true,
      parentAgentId: "user_agent_1",
      commissionRate: 10,
    },
  ];

  for (const user of demoUsers) {
    try {
      await db.insert(users).values(user);
      console.log(`✅ ${user.role.toUpperCase().padEnd(15)} | Username: ${user.username.padEnd(15)} | Password: ${user.username}123`);
    } catch (error: any) {
      if (error.message?.includes("Duplicate")) {
        console.log(`⚠️  ${user.role.toUpperCase().padEnd(15)} | Username: ${user.username.padEnd(15)} | Già esistente`);
      } else {
        console.error(`❌ Errore creando ${user.username}:`, error.message);
      }
    }
  }
  
  console.log("\n✅ Creazione utenti completata!");
  console.log("\n📋 CREDENZIALI DI ACCESSO:");
  console.log("━".repeat(60));
  console.log("  MASTER        | username: master        | password: master123");
  console.log("  ADMIN         | username: admin         | password: admin123");
  console.log("  AGENTE        | username: agente        | password: agente123");
  console.log("  COLLABORATORE | username: collaboratore | password: collaboratore123");
  console.log("━".repeat(60));
  
  process.exit(0);
}

createDemoUsers().catch(console.error);

