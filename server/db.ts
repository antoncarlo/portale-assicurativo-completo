import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, productTypes, policies, InsertPolicy, claims, InsertClaim, documents, InsertDocument, notifications, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Prodotti
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(productTypes).where(eq(productTypes.active, "yes"));
  return result;
}

export async function getProductById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productTypes).where(eq(productTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Polizze
export async function getAllPolicies(userId?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (userId) {
    return await db.select().from(policies).where(eq(policies.userId, userId));
  }
  return await db.select().from(policies);
}

export async function getPolicyById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(policies).where(eq(policies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPolicy(policy: InsertPolicy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(policies).values(policy);
  return policy;
}

export async function getPolicyStats(userId?: string) {
  const db = await getDb();
  if (!db) return { total: 0, active: 0, byStatus: {}, totalPremium: 0 };
  
  const allPolicies = await getAllPolicies(userId);
  const active = allPolicies.filter(p => p.status === "active" || p.status === "issued").length;
  const byStatus = allPolicies.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalPremium = allPolicies.reduce((sum, p) => {
    return sum + (parseFloat(p.premiumAmount || "0") || 0);
  }, 0);
  
  return {
    total: allPolicies.length,
    active,
    byStatus,
    totalPremium
  };
}

// Sinistri
export async function getAllClaims() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(claims);
}

export async function getClaimById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(claims).where(eq(claims.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClaim(claim: InsertClaim) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(claims).values(claim);
  return claim;
}

// Documenti
export async function getAllDocuments(relatedId?: string) {
  const db = await getDb();
  if (!db) return [];
  if (relatedId) {
    return await db.select().from(documents).where(eq(documents.relatedId, relatedId));
  }
  return await db.select().from(documents);
}

export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(documents).values(document);
  return document;
}
