import { create } from 'zustand';
import { Category } from '@/types';
import { getDatabase } from '@/db';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  loadCategories: (vaultId: string) => Promise<void>;
  createCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByParent: (parentId: string | null) => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,

  loadCategories: async (vaultId) => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      const result = await db.getAllAsync<Category>(
        'SELECT * FROM category WHERE vault_id = ? ORDER BY name ASC',
        [vaultId]
      );
      set({ categories: result });
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    const id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const category: Category = {
      ...categoryData,
      id,
    };

    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO category (id, vault_id, name, icon, color, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
      [category.id, category.vault_id, category.name, category.icon, category.color, category.parent_id]
    );

    set((state) => ({ categories: [...state.categories, category] }));
    return category;
  },

  updateCategory: async (id, updates) => {
    const db = await getDatabase();
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');

    await db.runAsync(`UPDATE category SET ${setClause} WHERE id = ?`, [...values, id]);

    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },

  deleteCategory: async (id) => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM category WHERE id = ?', [id]);

    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },

  getCategoryById: (id) => {
    return get().categories.find((c) => c.id === id);
  },

  getCategoriesByParent: (parentId) => {
    return get().categories.filter((c) => c.parent_id === parentId);
  },
}));

