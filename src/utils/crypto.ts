import * as nacl from 'tweetnacl';
import { randomBytes } from '@stablelib/random';
import * as SecureStore from 'expo-secure-store';

const MASTER_KEY_STORAGE_KEY = 'master_key';

/**
 * Génère une clé maître aléatoire (32 bytes pour XSalsa20)
 */
export const generateMasterKey = (): Uint8Array => {
  return randomBytes(32);
};

/**
 * Récupère la clé maître depuis SecureStore
 */
export const getMasterKey = async (): Promise<Uint8Array | null> => {
  const keyBase64 = await SecureStore.getItemAsync(MASTER_KEY_STORAGE_KEY);
  if (!keyBase64) {
    return null;
  }
  // Convertir depuis base64
  const keyBytes = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  return keyBytes;
};

/**
 * Sauvegarde la clé maître dans SecureStore
 */
export const saveMasterKey = async (key: Uint8Array): Promise<void> => {
  // Convertir en base64 pour le stockage
  const keyBase64 = btoa(String.fromCharCode(...key));
  await SecureStore.setItemAsync(MASTER_KEY_STORAGE_KEY, keyBase64);
};

/**
 * Chiffre un texte avec XSalsa20-Poly1305
 */
export const encryptField = (plaintext: string, key: Uint8Array): string => {
  const nonce = randomBytes(nacl.secretbox.nonceLength);
  const messageBytes = new TextEncoder().encode(plaintext);
  const ciphertext = nacl.secretbox(messageBytes, nonce, key);

  if (!ciphertext) {
    throw new Error('Échec du chiffrement');
  }

  // Combiner nonce + ciphertext en base64
  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);

  return btoa(String.fromCharCode(...combined));
};

/**
 * Déchiffre un texte avec XSalsa20-Poly1305
 */
export const decryptField = (encrypted: string, key: Uint8Array): string => {
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const nonce = combined.slice(0, nacl.secretbox.nonceLength);
  const ciphertext = combined.slice(nacl.secretbox.nonceLength);

  const plaintext = nacl.secretbox.open(ciphertext, nonce, key);
  if (!plaintext) {
    throw new Error('Échec du déchiffrement');
  }

  return new TextDecoder().decode(plaintext);
};

/**
 * Chiffre un champ sensible (note, etc.) avec la clé maître
 */
export const encryptSensitiveField = async (plaintext: string): Promise<string> => {
  const key = await getMasterKey();
  if (!key) {
    throw new Error('Clé maître non trouvée');
  }
  return encryptField(plaintext, key);
};

/**
 * Déchiffre un champ sensible avec la clé maître
 */
export const decryptSensitiveField = async (encrypted: string): Promise<string> => {
  const key = await getMasterKey();
  if (!key) {
    throw new Error('Clé maître non trouvée');
  }
  return decryptField(encrypted, key);
};

