import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  users, InsertUser,
  productTypes, InsertProductType,
  policies, InsertPolicy,
  policyCommunications,
  claims, InsertClaim,
  documents, InsertDocument,
  notifications, InsertNotification,
  commissions, InsertCommission
} from "../drizzle/schema";

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

// ===== USER MANAGEMENT =====

export async function createUser(userData: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Prepara i dati utente con solo i campi definiti nello schema
  const userToInsert: any = {
    id,
    username: userData.username,
    password: userData.password,
    email: userData.email,
    name: userData.name || null,
    phone: userData.phone || null,
    role: userData.role || "agent",
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    parentAgentId: userData.parentAgentId || null,
    commissionRate: userData.commissionRate || 0,
  };
  
  await db.insert(users).values(userToInsert);

  return id;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(users);
}

export async function updateUser(id: string, updates: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set(updates).where(eq(users.id, id));
}

export async function deleteUser(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(users).where(eq(users.id, id));
}

export async function updateLastSignIn(id: string) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, id));
}

// ===== PRODUCTS =====

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productTypes);
}

export async function getProductById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productTypes).where(eq(productTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== POLICIES =====

export async function getAllPolicies() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(policies);
}

export async function getPolicyById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(policies).where(eq(policies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPolicy(policyData: InsertPolicy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(policies).values({
    ...policyData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return id;
}

export async function updatePolicy(policyId: string, updates: Partial<InsertPolicy>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(policies)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(policies.id, policyId));

  return { success: true };
}

export async function deletePolicy(policyId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete communications first (foreign key)
  await db.delete(policyCommunications)
    .where(eq(policyCommunications.policyId, policyId));
  
  // Delete policy
  await db.delete(policies)
    .where(eq(policies.id, policyId));

  return { success: true };
}

export async function getPolicyStats() {
  const db = await getDb();
  if (!db) return {
    total: 0,
    active: 0,
    inQuotation: 0,
    totalPremium: 0
  };

  const allPolicies = await db.select().from(policies);
  
  return {
    total: allPolicies.length,
    active: allPolicies.filter(p => p.status === 'active').length,
    inQuotation: allPolicies.filter(p => p.status === 'in_quotation').length,
    totalPremium: allPolicies.reduce((sum, p) => sum + (parseFloat(p.premiumAmount || '0')), 0)
  };
}

// ===== CLAIMS =====

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

export async function createClaim(claimData: InsertClaim) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(claims).values({
    ...claimData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return id;
}

export async function updateClaim(id: string, updates: Partial<InsertClaim>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(claims).set({ ...updates, updatedAt: new Date() }).where(eq(claims.id, id));
  return { success: true };
}

// ===== POLICY COMMUNICATIONS =====

export async function getPolicyCommunications(policyId: string) {
  const db = await getDb();
  if (!db) return { communications: [] };
  try {
    const result: any = await db.execute(
      sql`SELECT * FROM policy_communications WHERE policyId = ${policyId} ORDER BY createdAt DESC`
    );
    return { communications: result[0] || [] };
  } catch (error) {
    console.error('[getPolicyCommunications] Error:', error);
    return { communications: [] };
  }
}

export async function addPolicyCommunication(data: any) {
  const db = await getDb();
  if (!db) return { success: false };
  const { randomUUID } = await import("crypto");
  const id = randomUUID();
  try {
    await db.execute(
      sql`INSERT INTO policy_communications (id, policyId, userId, userName, userRole, type, content, documentUrl, documentName) 
          VALUES (${id}, ${data.policyId}, ${data.userId}, ${data.userName}, ${data.userRole}, ${data.type}, ${data.content || null}, ${data.documentUrl || null}, ${data.documentName || null})`
    );
    return { success: true, id };
  } catch (error) {
    console.error('[addPolicyCommunication] Error:', error);
    return { success: false };
  }
}

// ===== DOCUMENTS =====

export async function getAllDocuments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents);
}

export async function getDocumentsByPolicyId(policyId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents).where(eq(documents.policyId, policyId));
}

export async function createDocument(documentData: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(documents).values({
    ...documentData,
    id,
    createdAt: new Date(),
  });

  return id;
}

// ===== NOTIFICATIONS =====

export async function createNotification(notificationData: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(notifications).values({
    ...notificationData,
    id,
    createdAt: new Date(),
  });

  return id;
}

export async function getUserNotifications(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
}

// ===== COMMISSIONS =====

export async function getCommissionsByAgentId(agentId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(commissions).where(eq(commissions.agentId, agentId));
}

export async function createCommission(commissionData: InsertCommission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const id = `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(commissions).values({
    ...commissionData,
    id,
    createdAt: new Date(),
  });

  return id;
}

// Legacy function for OAuth compatibility (will be removed after migration)
export async function upsertUser(user: any) {
  // This is a temporary bridge function
  // Real authentication will use createUser/updateUser
  console.warn("[Database] upsertUser called - this is a legacy function");
}

export async function getUser(id: string) {
  return getUserById(id);
}

// Toggle User Active Status
export async function toggleUserActive(userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get current user
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) throw new Error("User not found");

  // Toggle active status
  await db.update(users)
    .set({
      isActive: !user.isActive,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return { success: true, isActive: !user.isActive };
}

