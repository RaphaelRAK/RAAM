import * as nacl from "tweetnacl";
import { randomBytes } from "@stablelib/random";
import * as SecureStore from "expo-secure-store";

const MASTER_KEY_STORAGE_KEY = "master_key";

/**
 * Génère une clé maître de 32 bytes (256 bits) pour XSalsa20-Poly1305
 */
export const generateMasterKey = (): Uint8Array => {
  return randomBytes(32);
};

/**
 * Récupère la clé maître depuis SecureStore
 */
export const getMasterKey = async (): Promise<Uint8Array | null> => {
  try {
    const keyBase64 = await SecureStore.getItemAsync(MASTER_KEY_STORAGE_KEY);
    if (!keyBase64) {
      return null;
    }
    return Uint8Array.from(Buffer.from(keyBase64, "base64"));
  } catch (error) {
    console.error("Erreur lors de la récupération de la clé maître:", error);
    return null;
  }
};

/**
 * Stocke la clé maître dans SecureStore
 */
export const setMasterKey = async (key: Uint8Array): Promise<boolean> => {
  try {
    const keyBase64 = Buffer.from(key).toString("base64");
    await SecureStore.setItemAsync(MASTER_KEY_STORAGE_KEY, keyBase64);
    return true;
  } catch (error) {
    console.error("Erreur lors du stockage de la clé maître:", error);
    return false;
  }
};

/**
 * Chiffre un texte avec XSalsa20-Poly1305
 */
export const encrypt = (plaintext: string, key: Uint8Array): string => {
  const nonce = randomBytes(nacl.secretbox.nonceLength);
  const messageBytes = new TextEncoder().encode(plaintext);
  const ciphertext = nacl.secretbox(messageBytes, nonce, key);

  // Combine nonce + ciphertext en base64
  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);

  return Buffer.from(combined).toString("base64");
};

/**
 * Déchiffre un texte avec XSalsa20-Poly1305
 */
export const decrypt = (encrypted: string, key: Uint8Array): string | null => {
  try {
    const combined = Uint8Array.from(Buffer.from(encrypted, "base64"));
    const nonce = combined.slice(0, nacl.secretbox.nonceLength);
    const ciphertext = combined.slice(nacl.secretbox.nonceLength);

    const decrypted = nacl.secretbox.open(ciphertext, nonce, key);
    if (!decrypted) {
      return null;
    }

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Erreur lors du déchiffrement:", error);
    return null;
  }
};

/**
 * Chiffre un champ sensible (note, etc.) avec la clé maître
 */
export const encryptField = async (plaintext: string): Promise<string | null> => {
  const key = await getMasterKey();
  if (!key) {
    return null;
  }
  return encrypt(plaintext, key);
};

/**
 * Déchiffre un champ sensible avec la clé maître
 */
export const decryptField = async (encrypted: string): Promise<string | null> => {
  const key = await getMasterKey();
  if (!key) {
    return null;
  }
  return decrypt(encrypted, key);
};

