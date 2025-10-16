import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Prodotti assicurativi
export const productTypes = mysqlTable("product_types", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  active: mysqlEnum("active", ["yes", "no"]).default("yes").notNull(),
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
