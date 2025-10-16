import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Tabella utenti con autenticazione completa
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Hashed password
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", ["master", "admin", "agent", "collaborator"]).default("agent").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  parentAgentId: varchar("parentAgentId", { length: 64 }), // Per gerarchia agenti
  commissionRate: int("commissionRate").default(0), // Percentuale provvigione
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Prodotti assicurativi
export const productTypes = mysqlTable("product_types", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  icon: varchar("icon", { length: 50 }),
  questionnaireFile: varchar("questionnaireFile", { length: 500 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type ProductType = typeof productTypes.$inferSelect;
export type InsertProductType = typeof productTypes.$inferInsert;

// Polizze
export const policies = mysqlTable("policies", {
  id: varchar("id", { length: 64 }).primaryKey(),
  policyNumber: varchar("policyNumber", { length: 100 }).unique(),
  productTypeId: varchar("productTypeId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 50 }),
  status: mysqlEnum("status", ["quote_requested", "in_quotation", "quoted", "issued", "active", "expired", "cancelled"]).default("quote_requested").notNull(),
  premiumAmount: varchar("premiumAmount", { length: 20 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = typeof policies.$inferInsert;

// Dati polizza (JSON flessibile per questionari dinamici)
export const policyData = mysqlTable("policy_data", {
  id: varchar("id", { length: 64 }).primaryKey(),
  policyId: varchar("policyId", { length: 64 }).notNull(),
  fieldName: varchar("fieldName", { length: 255 }).notNull(),
  fieldValue: text("fieldValue"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type PolicyData = typeof policyData.$inferSelect;
export type InsertPolicyData = typeof policyData.$inferInsert;

// Sinistri
export const claims = mysqlTable("claims", {
  id: varchar("id", { length: 64 }).primaryKey(),
  claimNumber: varchar("claimNumber", { length: 100 }).unique(),
  policyId: varchar("policyId", { length: 64 }).notNull(),
  claimDate: timestamp("claimDate").notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["reported", "under_review", "approved", "rejected", "paid", "closed"]).default("reported").notNull(),
  claimAmount: varchar("claimAmount", { length: 20 }),
  paidAmount: varchar("paidAmount", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Claim = typeof claims.$inferSelect;
export type InsertClaim = typeof claims.$inferInsert;

// Documenti
export const documents = mysqlTable("documents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: varchar("fileSize", { length: 20 }),
  mimeType: varchar("mimeType", { length: 100 }),
  category: mysqlEnum("category", ["policy", "claim", "quote", "other"]).default("other").notNull(),
  policyId: varchar("policyId", { length: 64 }), // Renamed from relatedId for clarity
  uploadedBy: varchar("uploadedBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Notifiche
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  type: mysqlEnum("type", ["info", "warning", "success", "error"]).default("info").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  relatedId: varchar("relatedId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Provvigioni
export const commissions = mysqlTable("commissions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  policyId: varchar("policyId", { length: 64 }).notNull(),
  agentId: varchar("agentId", { length: 64 }).notNull(), // Renamed from userId for clarity
  amount: varchar("amount", { length: 20 }).notNull(),
  percentage: varchar("percentage", { length: 10 }),
  status: mysqlEnum("status", ["pending", "approved", "paid"]).default("pending").notNull(),
  paidDate: timestamp("paidDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = typeof commissions.$inferInsert;

