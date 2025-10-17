import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

async function fixProductsSQL() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL non configurato!");
    process.exit(1);
  }

  console.log("🔧 Connessione al database...");
  const db = drizzle(DATABASE_URL);

  try {
    // Aggiorna direttamente con SQL
    console.log("✅ Attivazione prodotti con SQL diretto...");
    
    await db.execute(sql`UPDATE product_types SET active = 1`);
    console.log("   ✓ Tutti i prodotti attivati");

    // Verifica
    const result: any = await db.execute(sql`SELECT id, name, active, questionnaireFile FROM product_types`);
    console.log("\n📊 Verifica prodotti:");
    result[0].forEach((p: any) => {
      console.log(`   ${p.active ? '✅' : '❌'} ${p.name} - Active: ${p.active} - File: ${p.questionnaireFile ? 'OK' : 'NO'}`);
    });

    console.log("\n✅ Riparazione completata!");

  } catch (error) {
    console.error("❌ Errore:", error);
    process.exit(1);
  }

  process.exit(0);
}

fixProductsSQL();

