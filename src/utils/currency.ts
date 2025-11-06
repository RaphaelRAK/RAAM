/**
 * Formate un montant avec devise
 */
export const formatCurrency = (amount: number, currency: string = "EUR"): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Parse un montant depuis un string
 */
export const parseAmount = (value: string): number => {
  // Enlève les espaces et remplace la virgule par un point
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formate un montant pour l'input (sans devise)
 */
export const formatAmountForInput = (amount: number): string => {
  return amount.toFixed(2).replace(".", ",");
};

