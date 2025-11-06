import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabaseAsync('budget.db');
  await createTables(dbInstance);
  return dbInstance;
};

export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
};

