/**
 * Service de gestion des transactions
 */

import { getDatabase, getAllAsync, getFirstAsync, execSqlAsync } from '@/db';
import { Transaction, TransactionType } from '@/types';
import { generateId } from '@/utils/id';
import { encrypt, decrypt } from '@/utils/crypto';

/**
 * Récupère toutes les transactions d'un coffre
 */
export const getTransactionsByVault = async (
  vaultId: string,
  limit?: number
): Promise<Transaction[]> => {
  const query = limit
    ? `SELECT * FROM transaction WHERE vault_id = ? AND is_archived = 0 ORDER BY date DESC LIMIT ?`
    : `SELECT * FROM transaction WHERE vault_id = ? AND is_archived = 0 ORDER BY date DESC`;
  const params = limit ? [vaultId, limit] : [vaultId];
  const result = await getAllAsync<Transaction>(query, params);
  
  // Déchiffrer les notes
  for (const tx of result) {
    if (tx.note) {
      try {
        tx.note = await decrypt(tx.note);
      } catch {
        // Si le déchiffrement échoue, garder la note chiffrée ou vide
        tx.note = '';
      }
    }
  }
  
  return result;
};

/**
 * Récupère une transaction par ID
 */
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  const result = await getFirstAsync<Transaction>(
    'SELECT * FROM transaction WHERE id = ?',
    [id]
  );
  
  if (result && result.note) {
    try {
      result.note = await decrypt(result.note);
    } catch {
      result.note = '';
    }
  }
  
  return result || null;
};

/**
 * Crée une transaction
 */
export const createTransaction = async (
  vaultId: string,
  type: TransactionType,
  amount: number,
  currency: string,
  categoryId: string | null,
  note: string,
  date: number,
  photoUri: string | null = null,
  merchant: string = '',
  recurrenceRule: string | null = null
): Promise<Transaction> => {
  const db = getDatabase();
  const id = generateId();
  const now = Date.now();

  // Chiffrer la note si elle existe
  let encryptedNote = '';
  if (note) {
    try {
      encryptedNote = await encrypt(note);
    } catch {
      // Si le chiffrement échoue, stocker vide
      encryptedNote = '';
    }
  }

  await execSqlAsync(`INSERT INTO transaction (
      id, vault_id, type, amount, currency, category_id, note, date,
      photo_uri, merchant, recurrence_rule, created_at, updated_at, is_archived
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      vaultId,
      type,
      amount,
      currency,
      categoryId,
      encryptedNote,
      date,
      photoUri,
      merchant,
      recurrenceRule,
      now,
      now,
      0,
    ]
  );

  const transaction = await getTransactionById(id);
  if (!transaction) {
    throw new Error('Failed to create transaction');
  }
  return transaction;
};

/**
 * Met à jour une transaction
 */
export const updateTransaction = async (
  id: string,
  updates: Partial<
    Pick<
      Transaction,
      | 'type'
      | 'amount'
      | 'category_id'
      | 'note'
      | 'date'
      | 'photo_uri'
      | 'merchant'
      | 'recurrence_rule'
    >
  >
): Promise<void> => {
  const db = getDatabase();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.type !== undefined) {
    fields.push('type = ?');
    values.push(updates.type);
  }
  if (updates.amount !== undefined) {
    fields.push('amount = ?');
    values.push(updates.amount);
  }
  if (updates.category_id !== undefined) {
    fields.push('category_id = ?');
    values.push(updates.category_id);
  }
  if (updates.note !== undefined) {
    // Chiffrer la note
    let encryptedNote = '';
    if (updates.note) {
      try {
        encryptedNote = await encrypt(updates.note);
      } catch {
        encryptedNote = '';
      }
    }
    fields.push('note = ?');
    values.push(encryptedNote);
  }
  if (updates.date !== undefined) {
    fields.push('date = ?');
    values.push(updates.date);
  }
  if (updates.photo_uri !== undefined) {
    fields.push('photo_uri = ?');
    values.push(updates.photo_uri);
  }
  if (updates.merchant !== undefined) {
    fields.push('merchant = ?');
    values.push(updates.merchant);
  }
  if (updates.recurrence_rule !== undefined) {
    fields.push('recurrence_rule = ?');
    values.push(updates.recurrence_rule);
  }

  if (fields.length === 0) {
    return;
  }

  fields.push('updated_at = ?');
  values.push(Date.now());
  values.push(id);

  await execSqlAsync(`UPDATE transaction SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Archive une transaction
 */
export const archiveTransaction = async (id: string): Promise<void> => {
  const db = getDatabase();
  await execSqlAsync('UPDATE transaction SET is_archived = 1, updated_at = ? WHERE id = ?',
    [Date.now(), id]
  );
};

/**
 * Supprime une transaction
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  const db = getDatabase();
  await execSqlAsync('DELETE FROM transaction WHERE id = ?', [id]);
};

/**
 * Calcule le solde d'un coffre
 */
export const calculateBalance = async (vaultId: string): Promise<number> => {
  const db = getDatabase();
  const result = await getFirstAsync(
    `SELECT 
      COALESCE(SUM(CASE WHEN type = 'IN' THEN amount ELSE -amount END), 0) as total
    FROM transaction 
    WHERE vault_id = ? AND is_archived = 0`,
    [vaultId]
  ) as { total: number } | null;
  return result?.total || 0;
};

