import { z } from "zod";

export const cardTypeSchema = z.enum(["virtual", "physical", "disposable"]);
export type CardType = z.infer<typeof cardTypeSchema>;

export const cardCategorySchema = z.enum([
  "shopping",
  "travel",
  "gaming",
  "utilities",
  "subscriptions",
]);
export type CardCategory = z.infer<typeof cardCategorySchema>;

export const cardStatusSchema = z.enum(["active", "frozen", "deleted"]);
export type CardStatus = z.infer<typeof cardStatusSchema>;

export const riskLevelSchema = z.enum(["low", "medium", "high"]);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

export const virtualCardSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Card name is required"),
  type: cardTypeSchema,
  cardNumber: z.string(),
  expiryDate: z.string(),
  cvv: z.string(),
  dailyLimit: z.number().min(0),
  perTransactionLimit: z.number().min(0),
  categories: z.array(cardCategorySchema),
  autoFreezeAfterInactivity: z.boolean(),
  twoFactorAuth: z.boolean(),
  instantNotifications: z.boolean(),
  status: cardStatusSchema,
  riskLevel: riskLevelSchema,
  createdAt: z.string(),
  lastUsed: z.string().nullable(),
  cardBrand: z.enum(["visa", "mastercard"]),
  gradient: z.string(),
  solBalance: z.number().default(0),
  depositAddress: z.string().nullable(),
  deposits: z.array(z.object({
    txSignature: z.string(),
    amount: z.number(),
    timestamp: z.string(),
  })).default([]),
  processingUntil: z.string().nullable().default(null),
  activeFrom: z.string().nullable().default(null),
  activeUntil: z.string().nullable().default(null),
});

export type VirtualCard = z.infer<typeof virtualCardSchema>;

export const insertCardSchema = virtualCardSchema.omit({
  id: true,
  cardNumber: true,
  cvv: true,
  status: true,
  riskLevel: true,
  createdAt: true,
  lastUsed: true,
  cardBrand: true,
  gradient: true,
  solBalance: true,
  depositAddress: true,
  deposits: true,
  processingUntil: true,
}).extend({
  activeFrom: z.string().nullable().optional(),
  activeUntil: z.string().nullable().optional(),
});

export type InsertCard = z.infer<typeof insertCardSchema>;

export const transactionTypeSchema = z.enum([
  "purchase",
  "refund",
  "authorization",
  "declined",
]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  cardName: z.string(),
  type: transactionTypeSchema,
  amount: z.number(),
  merchant: z.string(),
  category: cardCategorySchema,
  timestamp: z.string(),
  status: z.enum(["completed", "pending", "failed"]),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const activityLogSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  cardName: z.string(),
  action: z.enum([
    "created",
    "frozen",
    "unfrozen",
    "deleted",
    "limit_updated",
    "fraud_detected",
    "transaction",
    "deposit",
    "withdraw",
  ]),
  description: z.string(),
  timestamp: z.string(),
});

export type ActivityLog = z.infer<typeof activityLogSchema>;

export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users;
