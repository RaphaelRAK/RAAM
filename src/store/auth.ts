import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { generateMasterKey, setMasterKey, getMasterKey } from "@/services/crypto";
import { generateRecoveryKey } from "@/services/recovery";
import { generateId } from "@/utils/id";
import { getDatabase } from "@/db";
import { UserLocal } from "@/types";

interface AuthState {
  isInitialized: boolean;
  isOnboarded: boolean;
  userLocal: UserLocal | null;
  recoveryKey: string[] | null;
  masterKey: Uint8Array | null;
  initialize: () => Promise<void>;
  createUser: () => Promise<{ recoveryKey: string[] }>;
  setRecoveryKey: (key: string[]) => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isInitialized: false,
  isOnboarded: false,
  userLocal: null,
  recoveryKey: null,
  masterKey: null,

  initialize: async () => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ id_device: string; created_at: number; recovery_hint?: string }>(
      "SELECT * FROM user_local LIMIT 1"
    );

    if (result) {
      const masterKey = await getMasterKey();
      set({
        isInitialized: true,
        isOnboarded: true,
        userLocal: {
          id_device: result.id_device,
          created_at: result.created_at,
          recovery_hint: result.recovery_hint,
        },
        masterKey,
      });
    } else {
      set({ isInitialized: true, isOnboarded: false });
    }
  },

  createUser: async () => {
    const db = await getDatabase();
    const deviceId = generateId();
    const createdAt = Date.now();
    const masterKey = generateMasterKey();
    const recoveryKey = generateRecoveryKey();

    await setMasterKey(masterKey);
    await db.runAsync(
      "INSERT INTO user_local (id_device, created_at) VALUES (?, ?)",
      deviceId,
      createdAt
    );

    set({
      isOnboarded: true,
      userLocal: {
        id_device: deviceId,
        created_at: createdAt,
      },
      recoveryKey,
      masterKey,
    });

    return { recoveryKey };
  },

  setRecoveryKey: (key: string[]) => {
    set({ recoveryKey: key });
  },

  loadUser: async () => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ id_device: string; created_at: number; recovery_hint?: string }>(
      "SELECT * FROM user_local LIMIT 1"
    );

    if (result) {
      const masterKey = await getMasterKey();
      set({
        userLocal: {
          id_device: result.id_device,
          created_at: result.created_at,
          recovery_hint: result.recovery_hint,
        },
        masterKey,
      });
    }
  },
}));

