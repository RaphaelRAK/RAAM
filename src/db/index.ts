import { openDatabase, SQLiteDatabase, Query, ResultSet } from 'expo-sqlite';
import { createTables } from './schema';

let dbInstance: SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = openDatabase('budget.db');
    await createTables(dbInstance);
    return dbInstance;
  } catch (error) {
    console.error("Erreur lors de l'ouverture de la base de données:", error);
    throw error;
  }
};

/**
 * Exécute une requête SQL et retourne le premier résultat
 */
export const getFirstAsync = async <T = any>(
  db: SQLiteDatabase,
  sql: string,
  args: unknown[] = []
): Promise<T | null> => {
  const queries: Query[] = [{ sql, args }];
  const results = await db.execAsync(queries, false);
  
  if (results.length === 0 || 'error' in results[0]) {
    return null;
  }
  
  const result = results[0] as ResultSet;
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0] as T;
};

/**
 * Exécute une requête SQL (INSERT, UPDATE, DELETE)
 */
export const runAsync = async (
  db: SQLiteDatabase,
  sql: string,
  args: unknown[] = []
): Promise<void> => {
  const queries: Query[] = [{ sql, args }];
  const results = await db.execAsync(queries, false);
  
  if (results.length > 0 && 'error' in results[0]) {
    throw (results[0] as { error: Error }).error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
};

export const initDatabase = async (): Promise<void> => {
  await getDatabase();
};