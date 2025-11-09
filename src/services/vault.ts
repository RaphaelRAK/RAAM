/**
 * Service de gestion des coffres (vaults)
 */

import { getDatabase, getAllAsync, getFirstAsync, execSqlAsync } from '@/db';
import { Vault } from '@/types';
import { generateId } from '@/utils/id';

/**
 * Récupère tous les coffres
 */
export const getAllVaults = async (): Promise<Vault[]> => {
  const result = await getAllAsync<Vault>('SELECT * FROM vault ORDER BY is_default DESC, name ASC');
  return result;
};

/**
 * Récupère un coffre par ID
 */
export const getVaultById = async (id: string): Promise<Vault | null> => {
  const result = await getFirstAsync<Vault>(
    'SELECT * FROM vault WHERE id = ?',
    [id]
  );
  return result;
};

/**
 * Récupère le coffre par défaut
 */
export const getDefaultVault = async (): Promise<Vault | null> => {
  const result = await getFirstAsync<Vault>(
    'SELECT * FROM vault WHERE is_default = 1 LIMIT 1'
  );
  return result;
};

/**
 * Crée un nouveau coffre
 */
export const createVault = async (
  name: string,
  currency: string = 'EUR'
): Promise<Vault> => {
  const db = getDatabase();
  const id = generateId();

  await execSqlAsync(
    'INSERT INTO vault (id, name, currency, is_default) VALUES (?, ?, ?, ?)',
    [id, name, currency, 0]
  );

  const vault = await getVaultById(id);
  if (!vault) {
    throw new Error('Failed to create vault');
  }
  return vault;
};

/**
 * Met à jour un coffre
 */
export const updateVault = async (
  id: string,
  updates: Partial<Pick<Vault, 'name' | 'currency' | 'is_default'>>
): Promise<void> => {
  const db = getDatabase();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.currency !== undefined) {
    fields.push('currency = ?');
    values.push(updates.currency);
  }
  if (updates.is_default !== undefined) {
    fields.push('is_default = ?');
    values.push(updates.is_default);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  await execSqlAsync(
    `UPDATE vault SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Supprime un coffre
 */
export const deleteVault = async (id: string): Promise<void> => {
  await execSqlAsync('DELETE FROM vault WHERE id = ?', [id]);
};

