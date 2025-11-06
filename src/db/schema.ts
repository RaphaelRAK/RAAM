import { SQLiteDatabase } from "expo-sqlite";

export const createTables = async (db: SQLiteDatabase): Promise<void> => {
  // User Local
import { SQLiteDatabase } from 'expo-sqlite';

export const createTables = async (db: SQLiteDatabase): Promise<void> => {
  // User local
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_local (
      id_device TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      recovery_hint TEXT
    );
  `);

  // Vault
  // Vaults
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS vault (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      currency TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Category
  // Categories
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS category (
      id TEXT PRIMARY KEY,
      vault_id TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      parent_id TEXT,
      FOREIGN KEY (vault_id) REFERENCES vault(id) ON DELETE CASCADE
    );
  `);

  // Transaction
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      parent_id TEXT,
      FOREIGN KEY (vault_id) REFERENCES vault(id),
      FOREIGN KEY (parent_id) REFERENCES category(id)
    );
  `);

  // Transactions
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transaction (
      id TEXT PRIMARY KEY,
      vault_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('IN', 'OUT')),
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      currency TEXT NOT NULL,
      category_id TEXT,
      note TEXT,
      date INTEGER NOT NULL,
      photo_uri TEXT,
      merchant TEXT,
      recurrence_rule TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      is_archived INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (vault_id) REFERENCES vault(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
    );
  `);

  // Budget
      FOREIGN KEY (vault_id) REFERENCES vault(id),
      FOREIGN KEY (category_id) REFERENCES category(id)
    );
  `);

  // Budgets
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budget (
      id TEXT PRIMARY KEY,
      vault_id TEXT NOT NULL,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      period TEXT NOT NULL CHECK(period IN ('daily', 'weekly', 'monthly', 'yearly')),
      start_date INTEGER NOT NULL,
      rollover INTEGER NOT NULL DEFAULT 0,
      categories_json TEXT,
      FOREIGN KEY (vault_id) REFERENCES vault(id) ON DELETE CASCADE
    );
  `);

  // Reminder
      period TEXT NOT NULL,
      start_date INTEGER NOT NULL,
      rollover INTEGER NOT NULL DEFAULT 0,
      categories_json TEXT NOT NULL,
      FOREIGN KEY (vault_id) REFERENCES vault(id)
    );
  `);

  // Reminders
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reminder (
      id TEXT PRIMARY KEY,
      vault_id TEXT NOT NULL,
      title TEXT NOT NULL,
      schedule_cron TEXT NOT NULL,
      payload_json TEXT,
      type TEXT NOT NULL CHECK(type IN ('transaction', 'budget', 'custom')),
      FOREIGN KEY (vault_id) REFERENCES vault(id) ON DELETE CASCADE
    );
  `);

  // Sync Outbox
      payload_json TEXT NOT NULL,
      type TEXT NOT NULL,
      FOREIGN KEY (vault_id) REFERENCES vault(id)
    );
  `);

  // Sync outbox
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY,
      table TEXT NOT NULL,
      row_id TEXT NOT NULL,
      op TEXT NOT NULL CHECK(op IN ('INSERT', 'UPDATE', 'DELETE')),
      payload_json TEXT NOT NULL,
      ts INTEGER NOT NULL
    );
  `);

  // Indexes
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_transaction_vault_date ON transaction(vault_id, date DESC);
    CREATE INDEX IF NOT EXISTS idx_transaction_category ON transaction(category_id);
    CREATE INDEX IF NOT EXISTS idx_category_vault ON category(vault_id);
    CREATE INDEX IF NOT EXISTS idx_budget_vault ON budget(vault_id);
    CREATE INDEX IF NOT EXISTS idx_reminder_vault ON reminder(vault_id);
    CREATE INDEX IF NOT EXISTS idx_budget_vault ON budget(vault_id);
    CREATE INDEX IF NOT EXISTS idx_category_vault ON category(vault_id);
    CREATE INDEX IF NOT EXISTS idx_sync_outbox_ts ON sync_outbox(ts);
  `);
};

