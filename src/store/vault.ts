import { create } from "zustand";
import { getDatabase } from "@/db";
import { Vault } from "@/types";
import { generateId } from "@/utils/id";

interface VaultState {
  vaults: Vault[];
  currentVault: Vault | null;
  loadVaults: () => Promise<void>;
  createVault: (name: string, currency?: string) => Promise<Vault>;
  setCurrentVault: (vault: Vault) => void;
  getDefaultVault: () => Promise<Vault | null>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  vaults: [],
  currentVault: null,

  loadVaults: async () => {
    const db = await getDatabase();
    const results = await db.getAllAsync<Vault>("SELECT * FROM vault ORDER BY is_default DESC, name ASC");
    set({ vaults: results });
    
    const defaultVault = results.find((v) => v.is_default === 1) || results[0];
    if (defaultVault) {
      set({ currentVault: defaultVault });
    }
  },

  createVault: async (name: string, currency: string = "EUR") => {
    const db = await getDatabase();
    const id = generateId();
    const isDefault = get().vaults.length === 0 ? 1 : 0;

    await db.runAsync(
      "INSERT INTO vault (id, name, currency, is_default) VALUES (?, ?, ?, ?)",
      id,
      name,
      currency,
      isDefault
    );

    const vault: Vault = {
      id,
      name,
      currency,
      is_default: isDefault,
    };

    set((state) => ({
      vaults: [...state.vaults, vault],
      currentVault: isDefault ? vault : state.currentVault,
    }));

    return vault;
  },

  setCurrentVault: (vault: Vault) => {
    set({ currentVault: vault });
  },

  getDefaultVault: async () => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Vault>(
      "SELECT * FROM vault WHERE is_default = 1 LIMIT 1"
    );
    return result || null;
  },
}));

