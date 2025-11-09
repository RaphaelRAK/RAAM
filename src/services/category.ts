/**
 * Service de gestion des catégories
 */

import { getDatabase, getAllAsync, getFirstAsync, execSqlAsync } from '@/db';
import { Category } from '@/types';
import { generateId } from '@/utils/id';

/**
 * Récupère toutes les catégories d'un coffre
 */
export const getCategoriesByVault = async (vaultId: string): Promise<Category[]> => {
  const result = await getAllAsync<Category>(
    'SELECT * FROM category WHERE vault_id = ? ORDER BY name ASC',
    [vaultId]
  );
  return result;
};

/**
 * Récupère une catégorie par ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await getFirstAsync<Category>(
    'SELECT * FROM category WHERE id = ?',
    [id]
  );
  return result;
};

/**
 * Crée une catégorie
 */
export const createCategory = async (
  vaultId: string,
  name: string,
  icon: string,
  color: string,
  parentId: string | null = null
): Promise<Category> => {
  const db = getDatabase();
  const id = generateId();

  await execSqlAsync(
    'INSERT INTO category (id, vault_id, name, icon, color, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
    [id, vaultId, name, icon, color, parentId]
  );

  const category = await getCategoryById(id);
  if (!category) {
    throw new Error('Failed to create category');
  }
  return category;
};

/**
 * Met à jour une catégorie
 */
export const updateCategory = async (
  id: string,
  updates: Partial<Pick<Category, 'name' | 'icon' | 'color' | 'parent_id'>>
): Promise<void> => {
  const db = getDatabase();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.icon !== undefined) {
    fields.push('icon = ?');
    values.push(updates.icon);
  }
  if (updates.color !== undefined) {
    fields.push('color = ?');
    values.push(updates.color);
  }
  if (updates.parent_id !== undefined) {
    fields.push('parent_id = ?');
    values.push(updates.parent_id);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  await execSqlAsync(
    `UPDATE category SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Supprime une catégorie
 */
export const deleteCategory = async (id: string): Promise<void> => {
  await execSqlAsync('DELETE FROM category WHERE id = ?', [id]);
};

/**
 * Initialise les catégories par défaut
 */
export const initializeDefaultCategories = async (vaultId: string): Promise<void> => {
  const defaultCategories = [
    { name: 'Alimentation', icon: '🍔', color: '#F59E0B' },
    { name: 'Transport', icon: '🚗', color: '#3B82F6' },
    { name: 'Logement', icon: '🏠', color: '#8B5CF6' },
    { name: 'Santé', icon: '🏥', color: '#EF4444' },
    { name: 'Loisirs', icon: '🎮', color: '#22C55E' },
    { name: 'Shopping', icon: '🛍️', color: '#EC4899' },
    { name: 'Éducation', icon: '📚', color: '#06B6D4' },
    { name: 'Autres', icon: '📦', color: '#6B7280' },
  ];

  for (const cat of defaultCategories) {
    await createCategory(vaultId, cat.name, cat.icon, cat.color);
  }
};

