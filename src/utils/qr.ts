/**
 * Utilitaires pour QR codes
 * Génération et parsing des QR de liaison device
 */

/**
 * Génère un QR code pour la liaison de device
 * Contient: device_id, vault_id, timestamp
 */
export const generateQRData = (deviceId: string, vaultId: string): string => {
  const data = {
    device_id: deviceId,
    vault_id: vaultId,
    timestamp: Date.now(),
  };
  return JSON.stringify(data);
};

/**
 * Parse les données d'un QR code
 */
export const parseQRData = (qrString: string): {
  device_id: string;
  vault_id: string;
  timestamp: number;
} => {
  try {
    const data = JSON.parse(qrString);
    if (!data.device_id || !data.vault_id || !data.timestamp) {
      throw new Error('Invalid QR data format');
    }
    return data;
  } catch (error) {
    throw new Error('Failed to parse QR data');
  }
};

