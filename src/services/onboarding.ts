/**
 * Service d'onboarding - Création instantanée sans compte
 * Génère coffre + clé/QR
 */

import { generateMasterKey, storeMasterKey } from '@/utils/crypto';
import { generateRecoveryKey } from '@/utils/recovery';
import { generateDeviceId, generateId } from '@/utils/id';
import { initDatabase, getDatabase, execSqlAsync } from '@/db';
import { UserLocal, Vault } from '@/types';
import * as SecureStore from 'expo-secure-store';

/**
 * Initialise l'onboarding : crée le coffre local et génère la cucupération
 */
export const initializeOnboarding = async (): Promise<{
  deviceId: string;
  recoveryKey: string[];
  vaultId: string;
}> => {
  // 1. Générer la clé maître et la stocker
  const masterKey = await generateMasterKey();
  await storeMasterKey(masterKey);

  // 2. Générer l'ID du device
  const deviceId = generateDeviceId();

  // 3. Générer la clé de récupération (12 mots)
  const recoveryKey = await generateRecoveryKey();

  // 4. Initialiser la base de données
  await initDatabase();
  const db = getDatabase();

  // 5. Créer l'utilisateur local
  await execSqlAsync(
    `INSERT INTO user_local (id_device, created_at, recovery_hint) VALUES (?, ?, ?)`,
    [deviceId, Date.now(), recoveryKey.join(' ')]
  );

  // 6. Créer le coffre par défaut
  const vaultId = generateId();
  await execSqlAsync(
    `INSERT INTO vault (id, name, currency, is_default) VALUES (?, ?, ?, ?)`,
    [vaultId, 'Mon coffre', 'EUR', 1]
  );

  // 7. Stocker l'info que l'onboarding est complété
  await SecureStore.setItemAsync('onboarding_completed', 'true');
  await SecureStore.setItemAsync('device_id', deviceId);
  await SecureStore.setItemAsync('vault_id', vaultId);

  return {
    deviceId,
    recoveryKey,
    vaultId,
  };
};

/**
 * Vérifie si l'onboarding est déjà complété
 */
export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const completed = await SecureStore.getItemAsync('onboarding_completed');
    return completed === 'true';
  } catch {
    return false;
  }
};

/**
 * Récupère l'ID du device actuel
 */
export const getDeviceId = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('device_id');
  } catch {
    return null;
  }
};

/**
 * Récupère l'ID du coffre par défaut
 */
export const getDefaultVaultId = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('vault_id');
  } catch {
    return null;
  }
};

