import { z } from "zod";

// User Local
export const UserLocalSchema = z.object({
  id_device: z.string(),
  created_at: z.number(),
  recovery_hint: z.string().optional(),
});

export type UserLocal = z.infer<typeof UserLocalSchema>;

// Vault
export const VaultSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string().default("EUR"),
  is_default: z.number().default(0),
});

export type Vault = z.infer<typeof VaultSchema>;

// Category
export const CategorySchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parent_id: z.string().nullable().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

// Transaction
export const TransactionTypeSchema = z.enum(["IN", "OUT"]);

export const TransactionSchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  type: TransactionTypeSchema,
  amount: z.number(),
  currency: z.string().default("EUR"),
  category_id: z.string().nullable().optional(),
  note: z.string().optional(),
  date: z.number(),
  photo_uri: z.string().optional(),
  merchant: z.string().optional(),
  recurrence_rule: z.string().nullable().optional(),
  created_at: z.number(),
  updated_at: z.number(),
  is_archived: z.number().default(0),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

// Budget
export const BudgetPeriodSchema = z.enum(["daily", "weekly", "monthly", "yearly"]);

export const BudgetSchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  name: z.string(),
  amount: z.number(),
  period: BudgetPeriodSchema,
  start_date: z.number(),
  rollover: z.number().default(0),
  categories_json: z.string().optional(),
});

export type Budget = z.infer<typeof BudgetSchema>;
export type BudgetPeriod = z.infer<typeof BudgetPeriodSchema>;

// Reminder
export const ReminderTypeSchema = z.enum(["transaction", "budget", "custom"]);

export const ReminderSchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  title: z.string(),
  schedule_cron: z.string(),
  payload_json: z.string().optional(),
  type: ReminderTypeSchema,
});

export type Reminder = z.infer<typeof ReminderSchema>;
export type ReminderType = z.infer<typeof ReminderTypeSchema>;

// Sync Outbox
export const SyncOperationSchema = z.enum(["INSERT", "UPDATE", "DELETE"]);

export const SyncOutboxSchema = z.object({
  id: z.string(),
  table: z.string(),
  row_id: z.string(),
  op: SyncOperationSchema,
  payload_json: z.string(),
  ts: z.number(),
});

export type SyncOutbox = z.infer<typeof SyncOutboxSchema>;
export type SyncOperation = z.infer<typeof SyncOperationSchema>;
export type TransactionType = 'IN' | 'OUT';

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type ReminderType = 'transaction' | 'budget' | 'custom';

export interface UserLocal {
  id_device: string;
  created_at: number;
  recovery_hint?: string;
}

export interface Vault {
  id: string;
  name: string;
  currency: string;
  is_default: number;
}

export interface Category {
  id: string;
  vault_id: string;
  name: string;
  icon: string;
  color: string;
  parent_id: string | null;
}

export interface Transaction {
  id: string;
  vault_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category_id: string | null;
  note: string | null;
  date: number;
  photo_uri: string | null;
  merchant: string | null;
  recurrence_rule: string | null;
  created_at: number;
  updated_at: number;
  is_archived: number;
}

export interface Budget {
  id: string;
  vault_id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  start_date: number;
  rollover: number;
  categories_json: string;
}

export interface Reminder {
  id: string;
  vault_id: string;
  title: string;
  schedule_cron: string;
  payload_json: string;
  type: ReminderType;
}

export interface SyncOutbox {
  id: string;
  table: string;
  row_id: string;
  op: 'INSERT' | 'UPDATE' | 'DELETE';
  payload_json: string;
  ts: number;
}

