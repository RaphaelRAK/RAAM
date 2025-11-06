import { create } from 'zustand';
import { Vault } from '@/types';
import { getDatabase } from '@/db';

interface VaultState {
  vaults: Vault[];
  currentVaultId: string | null;
  isLoading: boolean;
  loadVaults: () => Promise<void>;
  setCurrentVault: (vaultId: string) => void;
  createVault: (vault: Omit<Vault, 'id'>) => Promise<Vault>;
  updateVault: (id: string, updates: Partial<Vault>) => Promise<void>;
  deleteVault: (id: string) => Promise<void>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  vaults: [],
  currentVaultId: null,
  isLoading: false,

  loadVaults: async () => {
    set({ isLoading: true });
    try {
      const db = await getDatabase();
      const result = await db.getAllAsync<Vault>('SELECT * FROM vault ORDER BY is_default DESC, name ASC');
      set({ vaults: result });
    } catch (error) {
      console.error('Erreur lors du chargement des vaults:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentVault: (vaultId: string) => {
    set({ currentVaultId: vaultId });
  },

  createVault: async (vaultData) => {
    const id = `vault_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const vault: Vault = {
      ...vaultData,
      id,
    };

    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO vault (id, name, currency, is_default) VALUES (?, ?, ?, ?)',
      [vault.id, vault.name, vault.currency, vault.is_default]
    );

    set((state) => ({ vaults: [...state.vaults, vault] }));
    return vault;
  },

  updateVault: async (id, updates) => {
    const db = await getDatabase();
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');

    await db.runAsync(`UPDATE vault SET ${setClause} WHERE id = ?`, [...values, id]);

    set((state) => ({
      vaults: state.vaults.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  },

  deleteVault: async (id) => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM vault WHERE id = ?', [id]);

    set((state) => ({
      vaults: state.vaults.filter((v) => v.id !== id),
      currentVaultId: state.currentVaultId === id ? null : state.currentVaultId,
    }));
  },
}));

