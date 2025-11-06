import { create } from "zustand";
import { getDatabase } from "@/db";
import { Transaction } from "@/types";
import { generateId } from "@/utils/id";
import { encryptField } from "@/services/crypto";

interface TransactionState {
  transactions: Transaction[];
  loadTransactions: (vaultId: string, limit?: number) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, "id" | "created_at" | "updated_at">) => Promise<Transaction>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],

  loadTransactions: async (vaultId: string, limit: number = 50) => {
    const db = await getDatabase();
    const results = await db.getAllAsync<Transaction>(
      "SELECT * FROM transaction WHERE vault_id = ? AND is_archived = 0 ORDER BY date DESC LIMIT ?",
      vaultId,
      limit
    );
    set({ transactions: results });
  },

  createTransaction: async (transactionData) => {
    const db = await getDatabase();
    const id = generateId();
    const now = Date.now();

    // Chiffrer la note si elle existe
    let encryptedNote = transactionData.note;
    if (transactionData.note) {
      const encrypted = await encryptField(transactionData.note);
      if (encrypted) {
        encryptedNote = encrypted;
      }
    }

    const transaction: Transaction = {
      ...transactionData,
      id,
      created_at: now,
      updated_at: now,
      note: encryptedNote,
    };

    await db.runAsync(
      `INSERT INTO transaction (
        id, vault_id, type, amount, currency, category_id, note, date,
        photo_uri, merchant, recurrence_rule, created_at, updated_at, is_archived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      transaction.id,
      transaction.vault_id,
      transaction.type,
      transaction.amount,
      transaction.currency,
      transaction.category_id || null,
      transaction.note || null,
      transaction.date,
      transaction.photo_uri || null,
      transaction.merchant || null,
      transaction.recurrence_rule || null,
      transaction.created_at,
      transaction.updated_at,
      transaction.is_archived
    );

    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));

    return transaction;
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>) => {
    const db = await getDatabase();
    const now = Date.now();

    // Chiffrer la note si elle est mise à jour
    let encryptedNote = updates.note;
    if (updates.note) {
      const encrypted = await encryptField(updates.note);
      if (encrypted) {
        encryptedNote = encrypted;
      }
    }

    const updateFields: string[] = [];
    const updateValues: unknown[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at") {
        updateFields.push(`${key} = ?`);
        updateValues.push(key === "note" ? encryptedNote : value);
      }
    });

    updateFields.push("updated_at = ?");
    updateValues.push(now);
    updateValues.push(id);

    await db.runAsync(
      `UPDATE transaction SET ${updateFields.join(", ")} WHERE id = ?`,
      ...updateValues
    );

    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: now } : t
      ),
    }));
  },

  deleteTransaction: async (id: string) => {
    const db = await getDatabase();
    await db.runAsync("UPDATE transaction SET is_archived = 1 WHERE id = ?", id);

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },
}));

