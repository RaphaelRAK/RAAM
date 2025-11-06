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

