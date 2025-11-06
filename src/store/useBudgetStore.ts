import { create } from 'zustand';
import { Budget } from '@/types';
import { getDatabase } from '@/db';
import { useTransactionStore } from './useTransactionStore';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  loadBudgets: (vaultId: string) => Promise<void>;
  createBudget: (budget: Omit<Budget, 'id'>) => Promise<Budget>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudgetProgress: (budgetId: string) => { used: number; total: number; percentage: number };
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  isLoading: false,

  loadBudgets: async (vaultId) => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      const result = await db.getAllAsync<Budget>(
        'SELECT * FROM budget WHERE vault_id = ? ORDER BY name ASC',
        [vaultId]
      );
      set({ budgets: result });
    } catch (error) {
      console.error('Erreur lors du chargement des budgets:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createBudget: async (budgetData) => {
    const id = `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const budget: Budget = {
      ...budgetData,
      id,
    };

    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO budget (id, vault_id, name, amount, period, start_date, rollover, categories_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        budget.id,
        budget.vault_id,
        budget.name,
        budget.amount,
        budget.period,
        budget.start_date,
        budget.rollover,
        budget.categories_json,
      ]
    );

    set((state) => ({ budgets: [...state.budgets, budget] }));
    return budget;
  },

  updateBudget: async (id, updates) => {
    const db = await getDatabase();
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');

    await db.runAsync(`UPDATE budget SET ${setClause} WHERE id = ?`, [...values, id]);

    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  deleteBudget: async (id) => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM budget WHERE id = ?', [id]);

    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    }));
  },

  getBudgetProgress: (budgetId) => {
    const budget = get().budgets.find((b) => b.id === budgetId);
    if (!budget) {
      return { used: 0, total: 0, percentage: 0 };
    }

    const transactions = useTransactionStore.getState().transactions;
    const categoryIds = JSON.parse(budget.categories_json) as string[];

    // Calculer la période
    const now = Date.now();
    let startDate = budget.start_date;
    const periodMs = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      yearly: 365 * 24 * 60 * 60 * 1000,
    }[budget.period];

    // Trouver le début de la période actuelle
    while (startDate + periodMs < now) {
      startDate += periodMs;
    }

    const endDate = startDate + periodMs;

    // Calculer les dépenses
    const used = transactions
      .filter(
        (t) =>
          t.vault_id === budget.vault_id &&
          t.type === 'OUT' &&
          t.date >= startDate &&
          t.date < endDate &&
          (!categoryIds.length || (t.category_id && categoryIds.includes(t.category_id)))
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const total = budget.amount;
    const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;

    return { used, total, percentage };
  },
}));

