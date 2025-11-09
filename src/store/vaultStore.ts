/**
 * Store Zustand pour les coffres
 */

import { create } from 'zustand';
import { Vault } from '@/types';
import { getAllVaults, getDefaultVault } from '@/services/vault';

interface VaultState {
  vaults: Vault[];
  currentVault: Vault | null;
  isLoading: boolean;
  loadVaults: () => Promise<void>;
  setCurrentVault: (vault: Vault | null) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  vaults: [],
  currentVault: null,
  isLoading: false,
  loadVaults: async () => {
    set({ isLoading: true });
    try {
      const vaults = await getAllVaults();
      const defaultVault = await getDefaultVault();
      set({
        vaults,
        currentVault: defaultVault || vaults[0] || null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading vaults:', error);
      set({ isLoading: false });
    }
  },
  setCurrentVault: (vault: Vault | null) => {
    set({ currentVault: vault });
  },
}));

