import { create } from 'zustand';
import { Transaction } from '@/types';
import { getDatabase } from '@/db';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  loadTransactions: (vaultId: string, limit?: number) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<Transaction>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByPeriod: (startDate: number, endDate: number) => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  loadTransactions: async (vaultId, limit) => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      let query = 'SELECT * FROM transaction WHERE vault_id = ? AND is_archived = 0 ORDER BY date DESC';
      const params: (string | number)[] = [vaultId];

      if (limit) {
        query += ' LIMIT ?';
        params.push(limit);
      }

      const result = await db.getAllAsync<Transaction>(query, params);
      set({ transactions: result });
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createTransaction: async (transactionData) => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const transaction: Transaction = {
      ...transactionData,
      id,
      created_at: now,
      updated_at: now,
      is_archived: 0,
    };

    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO transaction (
        id, vault_id, type, amount, currency, category_id, note, date,
        photo_uri, merchant, recurrence_rule, created_at, updated_at, is_archived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction.id,
        transaction.vault_id,
        transaction.type,
        transaction.amount,
        transaction.currency,
        transaction.category_id,
        transaction.note,
        transaction.date,
        transaction.photo_uri,
        transaction.merchant,
        transaction.recurrence_rule,
        transaction.created_at,
        transaction.updated_at,
        transaction.is_archived,
      ]
    );

    set((state) => ({ transactions: [transaction, ...state.transactions] }));
    return transaction;
  },

  updateTransaction: async (id, updates) => {
    const db = await getDatabase();
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');

    await db.runAsync(
      `UPDATE transaction SET ${setClause}, updated_at = ? WHERE id = ?`,
      [...values, Date.now(), id]
    );

    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: Date.now() } : t
      ),
    }));
  },

  deleteTransaction: async (id) => {
    const db = await getDatabase();
    await db.runAsync('UPDATE transaction SET is_archived = 1 WHERE id = ?', [id]);

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },

  getTransactionsByCategory: (categoryId) => {
    return get().transactions.filter((t) => t.category_id === categoryId);
  },

  getTransactionsByPeriod: (startDate, endDate) => {
    return get().transactions.filter((t) => t.date >= startDate && t.date <= endDate);
  },
}));

