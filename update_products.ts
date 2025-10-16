import { drizzle } from "drizzle-orm/mysql2";
import { productTypes } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

const productsWithQuestionnaires = [
  {
    id: "car-decennale",
    questionnaireFile: "/questionari/1.QuestionarioCAR+DecennalePostumaL210(1)(1)(3)(1).pdf"
  },
  {
    id: "iar-fotovoltaico",
    questionnaireFile: "/questionari/QuestionarioIAR-Fotovoltaico(1)(4).docx"
  },
  {
    id: "rc-edili",
    questionnaireFile: "/questionari/RichiestaquotazioneRCedilieindustriali.pdf"
  },
  {
    id: "multirischio-commerciale",
    questionnaireFile: "/questionari/SCHEDASEMPLIFICATA-MultirischiEserciziCommercialirev.1(002)(1).pdf"
  },
  {
    id: "polizza-pet",
    questionnaireFile: "/questionari/SCHEDAPolizzaPET.pdf"
  },
  {
    id: "multirischio-casa",
    questionnaireFile: "/questionari/SCHEDACOMPLETA-MultirischiCasaeFamigliarev.2-01.2025(003).pdf"
  },
  {
    id: "fidejussioni",
    questionnaireFile: "/questionari/Fideiussioni_Italia_Aggiornato(1)(1).docx"
  }
];

async function updateProducts() {
  for (const product of productsWithQuestionnaires) {
    await db.update(productTypes)
      .set({ questionnaireFile: product.questionnaireFile })
      .where(eq(productTypes.id, product.id));
    console.log(`Updated ${product.id}`);
  }
  console.log("All products updated!");
  process.exit(0);
}

updateProducts().catch(console.error);
