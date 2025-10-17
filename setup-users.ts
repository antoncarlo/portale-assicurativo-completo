import mysql from "mysql2/promise";
import fs from "fs";

async function setupUsers() {
  console.log("🔧 Creazione tabella users e inserimento utenti demo...\n");
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const sql = fs.readFileSync("create-users-table.sql", "utf-8");
  const statements = sql.split(";").filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await connection.query(statement);
      } catch (error: any) {
        if (!error.message.includes("Duplicate")) {
          console.error("❌ Errore:", error.message);
        }
      }
    }
  }
  
  console.log("✅ Tabella users creata!");
  console.log("✅ Utenti inseriti!\n");
  
  const [users] = await connection.query("SELECT username, role FROM users");
  console.log("📋 UTENTI NEL DATABASE:\n");
  console.log(users);
  
  console.log("\n🔑 CREDENZIALI DI ACCESSO:");
  console.log("━".repeat(60));
  console.log("  MASTER        | username: master        | password: master123");
  console.log("  ADMIN         | username: admin         | password: admin123");
  console.log("  AGENTE        | username: agente        | password: agente123");
  console.log("  COLLABORATORE | username: collaboratore | password: collaboratore123");
  console.log("━".repeat(60));
  
  await connection.end();
  process.exit(0);
}

setupUsers().catch(console.error);

