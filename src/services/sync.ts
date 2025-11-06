import { getDatabase } from "@/db";
import { SyncOutbox, SyncOperation } from "@/types";
import { generateId } from "@/utils/id";
import Constants from "expo-constants";

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Ajoute une opération à la file d'attente de synchronisation
 */
export const addToSyncOutbox = async (
  table: string,
  rowId: string,
  operation: SyncOperation,
  payload: Record<string, unknown>
): Promise<void> => {
  const db = await getDatabase();
  const id = generateId();
  const ts = Date.now();

  await db.runAsync(
    "INSERT INTO sync_outbox (id, table, row_id, op, payload_json, ts) VALUES (?, ?, ?, ?, ?, ?)",
    id,
    table,
    rowId,
    operation,
    JSON.stringify(payload),
    ts
  );
};

/**
 * Récupère les changements depuis le serveur
 */
export const pullChanges = async (
  sinceTs: number,
  vaultIds: string[]
): Promise<unknown[]> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return [];
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sync/pull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        since_ts: sinceTs,
        vault_ids: vaultIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du pull: ${response.statusText}`);
    }

    const data = await response.json();
    return data.changes || [];
  } catch (error) {
    console.error("Erreur lors du pull des changements:", error);
    return [];
  }
};

/**
 * Envoie les changements locaux au serveur
 */
export const pushChanges = async (deviceId: string): Promise<{
  applied: string[];
  conflicts: unknown[];
}> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { applied: [], conflicts: [] };
  }

  const db = await getDatabase();
  const outbox = await db.getAllAsync<SyncOutbox>(
    "SELECT * FROM sync_outbox ORDER BY ts ASC LIMIT 100"
  );

  if (outbox.length === 0) {
    return { applied: [], conflicts: [] };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sync/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        device_id: deviceId,
        changes: outbox.map((item) => ({
          table: item.table,
          row_id: item.row_id,
          op: item.op,
          payload: JSON.parse(item.payload_json),
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du push: ${response.statusText}`);
    }

    const data = await response.json();

    // Marque les changements appliqués comme traités
    for (const id of data.applied || []) {
      await db.runAsync("DELETE FROM sync_outbox WHERE id = ?", id);
    }

    return {
      applied: data.applied || [],
      conflicts: data.conflicts || [],
    };
  } catch (error) {
    console.error("Erreur lors du push des changements:", error);
    return { applied: [], conflicts: [] };
  }
};

/**
 * Synchronise les données (pull puis push)
 */
export const sync = async (deviceId: string, vaultIds: string[]): Promise<void> => {
  const db = await getDatabase();
  const lastSync = await db.getFirstAsync<{ ts: number }>(
    "SELECT MAX(ts) as ts FROM sync_outbox"
  );
  const sinceTs = lastSync?.ts || 0;

  // Pull des changements distants
  const remoteChanges = await pullChanges(sinceTs, vaultIds);
  // Appliquer les changements distants (LWW)
  // TODO: Implémenter la logique LWW

  // Push des changements locaux
  await pushChanges(deviceId);
};

