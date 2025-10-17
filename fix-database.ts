import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { productTypes } from "./drizzle/schema";

async function fixDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL non configurato!");
    process.exit(1);
  }

  console.log("🔧 Connessione al database...");
  const db = drizzle(DATABASE_URL);

  try {
    // 1. Attiva tutti i prodotti
    console.log("✅ Attivazione prodotti...");
    const products = await db.select().from(productTypes);
    
    for (const product of products) {
      await db.update(productTypes)
        .set({ active: true })
        .where(eq(productTypes.id, product.id));
      console.log(`   ✓ ${product.name} - attivato`);
    }

    // 2. Aggiorna i file questionari
    console.log("\n📄 Aggiornamento file questionari...");
    
    const questionnaireMap: Record<string, string> = {
      "car-decennale": "/questionari/1.QuestionarioCAR+DecennalePostumaL210(1)(1)(3)(1).pdf",
      "iar-fotovoltaico": "/questionari/QuestionarioIAR-Fotovoltaico(1)(4).docx",
      "rc-edili": "/questionari/RichiestaquotazioneRCedilieindustriali.pdf",
      "multirischio-commerciale": "/questionari/SCHEDASEMPLIFICATA-MultirischiEserciziCommercialirev.1(002)(1).pdf",
      "pet": "/questionari/SCHEDAPolizzaPET.pdf",
      "multirischio-casa": "/questionari/SCHEDACOMPLETA-MultirischiCasaeFamigliarev.2-01.2025(003).pdf",
      "fidejussioni": "/questionari/Fideiussioni_Italia_Aggiornato(1)(1).docx"
    };

    for (const [productId, questionnaireFile] of Object.entries(questionnaireMap)) {
      await db.update(productTypes)
        .set({ questionnaireFile })
        .where(eq(productTypes.id, productId));
      console.log(`   ✓ ${productId} - questionario aggiornato`);
    }

    console.log("\n✅ Database riparato con successo!");
    
    // Verifica finale
    console.log("\n📊 Verifica prodotti:");
    const updatedProducts = await db.select().from(productTypes);
    updatedProducts.forEach(p => {
      console.log(`   ${p.active ? '✅' : '❌'} ${p.name} - ${p.questionnaireFile ? 'Questionario OK' : 'Questionario mancante'}`);
    });

  } catch (error) {
    console.error("❌ Errore durante la riparazione:", error);
    process.exit(1);
  }

  process.exit(0);
}

fixDatabase();

