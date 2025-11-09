/**
 * Utilitaires pour la clé de récupération (12 mots)
 * Génération et validation BIP39
 */
import * as Crypto from 'expo-crypto';
import { BIP39_WORDS } from './mnemonic';

/**
 * Convertit un tableau de bytes en bits
 */
const bytesToBits = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join('');
};

/**
 * Calcule le hash SHA256 d'un tableau de bytes
 */
const sha256 = async (data: Uint8Array): Promise<Uint8Array> => {
  // Convertir les bytes en string pour digestStringAsync
  const dataString = Array.from(data)
    .map((b) => String.fromCharCode(b))
    .join('');
  
  // Calculer le hash SHA256 (retourne une string hex)
  const hashHex = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    dataString
  );
  
  // Convertir le hash hex en Uint8Array
  const hashBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    hashBytes[i] = parseInt(hashHex.substr(i * 2, 2), 16);
  }
  return hashBytes;
};

/**
 * Génère une clé de récupération BIP39 valide de 12 mots
 * 
 * Algorithme BIP39 :
 * 1. Générer 128 bits d'entropie (16 bytes)
 * 2. Calculer le checksum (4 bits = premiers 4 bits du SHA256)
 * 3. Combiner entropie + checksum = 132 bits
 * 4. Diviser en 12 groupes de 11 bits
 * 5. Chaque groupe = index dans la wordlist (0-2047)
 */
export const generateRecoveryKey = async (): Promise<string[]> => {
  // 1. Générer 128 bits d'entropie (16 bytes)
  const entropyBytes = await Crypto.getRandomBytesAsync(16);
  const entropy = new Uint8Array(entropyBytes);

  // 2. Calculer le checksum (4 bits = premiers 4 bits du SHA256)
  const hash = await sha256(entropy);
  const checksumBits = (hash[0] >> 4).toString(2).padStart(4, '0');

  // 3. Convertir l'entropie en bits et ajouter le checksum
  const entropyBits = bytesToBits(entropy);
  const combinedBits = entropyBits + checksumBits; // 128 + 4 = 132 bits

  // 4. Diviser en 12 groupes de 11 bits
  const words: string[] = [];
  for (let i = 0; i < 12; i++) {
    const startBit = i * 11;
    const endBit = startBit + 11;
    const wordBits = combinedBits.substring(startBit, endBit);
    
    // 5. Convertir les 11 bits en index (0-2047)
    const wordIndex = parseInt(wordBits, 2);
    words.push(BIP39_WORDS[wordIndex]);
  }

  return words;
};

/**
 * Valide une clé de récupération BIP39
 */
export const validateRecoveryKey = (words: string[]): boolean => {
  if (words.length !== 12) {
    return false;
  }
  
  // Vérifier que tous les mots sont dans la wordlist
  const allWordsValid = words.every((word) =>
    BIP39_WORDS.includes(word.toLowerCase())
  );
  
  if (!allWordsValid) {
    return false;
  }

  // TODO: Valider le checksum BIP39 (nécessite de reconstruire l'entropie)
  // Pour l'instant, on valide juste que les mots sont dans la wordlist
  return true;
};

/**
 * Formate la clé de récupération pour affichage
 */
export const formatRecoveryKey = (words: string[]): string => {
  return words.join(' ');
};

