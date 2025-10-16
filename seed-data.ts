import { drizzle } from "drizzle-orm/mysql2";
import { productTypes, policies } from "./drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const products = [
  {
    id: "car-decennale",
    name: "CAR + Decennale Postuma",
    code: "CAR_DECENNALE",
    description: "Assicurazione Contractors All Risks con copertura decennale postuma per lavori edili",
    icon: "Construction",
    active: "yes" as const,
  },
  {
    id: "iar-fotovoltaico",
    name: "IAR Fotovoltaico",
    code: "IAR_FOTOVOLTAICO",
    description: "Industrial All Risks per impianti fotovoltaici con copertura perdita produzione",
    icon: "SolarPower",
    active: "yes" as const,
  },
  {
    id: "rc-edili",
    name: "RC Edili e Industriali",
    code: "RC_EDILI",
    description: "Responsabilità Civile per imprese edili e industriali",
    icon: "Engineering",
    active: "yes" as const,
  },
  {
    id: "multirischio-commerciale",
    name: "Multirischio Esercizi Commerciali",
    code: "MULTIRISCHIO_COMMERCIALE",
    description: "Polizza multirischio completa per negozi e attività commerciali",
    icon: "Store",
    active: "yes" as const,
  },
  {
    id: "pet",
    name: "Polizza PET",
    code: "PET",
    description: "Assicurazione completa per animali domestici con spese veterinarie",
    icon: "Pets",
    active: "yes" as const,
  },
  {
    id: "multirischio-casa",
    name: "Multirischio Casa e Famiglia",
    code: "MULTIRISCHIO_CASA",
    description: "Polizza completa per abitazioni e nucleo familiare",
    icon: "Home",
    active: "yes" as const,
  },
  {
    id: "fidejussioni",
    name: "Fidejussioni",
    code: "FIDEJUSSIONI",
    description: "Cauzioni e fidejussioni per appalti pubblici e privati",
    icon: "Gavel",
    active: "yes" as const,
  },
];

const demoPolicies = [
  {
    id: "policy-1",
    policyNumber: "CAR-2025-00001",
    productTypeId: "car-decennale",
    userId: "demo-user",
    clientName: "Costruzioni Rossi S.r.l.",
    clientEmail: "info@costruzionirossi.it",
    clientPhone: "+39 02 1234567",
    status: "active" as const,
    premiumAmount: "15000",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
    notes: "Polizza per cantiere residenziale Milano",
  },
  {
    id: "policy-2",
    policyNumber: "IAR-2025-00001",
    productTypeId: "iar-fotovoltaico",
    userId: "demo-user",
    clientName: "Energia Verde S.p.A.",
    clientEmail: "commerciale@energiaverde.it",
    clientPhone: "+39 06 9876543",
    status: "quote_requested" as const,
    premiumAmount: null,
    startDate: null,
    endDate: null,
    notes: "Impianto fotovoltaico 500 kW",
  },
  {
    id: "policy-3",
    policyNumber: "RC-2025-00001",
    productTypeId: "rc-edili",
    userId: "demo-user",
    clientName: "Edil Costruzioni S.r.l.",
    clientEmail: "amministrazione@edilcostruzioni.it",
    clientPhone: "+39 011 5551234",
    status: "issued" as const,
    premiumAmount: "8500",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2026-02-01"),
    notes: "RC decennale per nuova costruzione Torino",
  },
  {
    id: "policy-4",
    policyNumber: "MULTI-COM-2025-00001",
    productTypeId: "multirischio-commerciale",
    userId: "demo-user",
    clientName: "Bar Centrale di Mario Bianchi",
    clientEmail: "mario.bianchi@email.it",
    clientPhone: "+39 333 1234567",
    status: "in_quotation" as const,
    premiumAmount: null,
    startDate: null,
    endDate: null,
    notes: "Bar in centro storico, 80 mq",
  },
];

async function seed() {
  console.log("Seeding products...");
  for (const product of products) {
    await db.insert(productTypes).values(product).onDuplicateKeyUpdate({ set: { active: product.active } });
  }
  console.log(`✓ ${products.length} products seeded`);

  console.log("Seeding demo policies...");
  for (const policy of demoPolicies) {
    await db.insert(policies).values(policy).onDuplicateKeyUpdate({ set: { status: policy.status } });
  }
  console.log(`✓ ${demoPolicies.length} demo policies seeded`);
  
  console.log("✓ Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
