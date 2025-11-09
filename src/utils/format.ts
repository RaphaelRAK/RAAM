/**
 * Utilitaires de formatage
 */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

import type { Currency } from '@/types';

/**
 * Formate un montant avec devise
 */
export const formatAmount = (amount: number, currency: Currency = 'EUR'): string => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Formate un montant sans devise (pour input)
 */
export const formatAmountInput = (amount: number): string => {
  return amount.toFixed(2).replace('.', ',');
};

/**
 * Parse un montant depuis un input
 */
export const parseAmountInput = (input: string): number => {
  const cleaned = input.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

/**
 * Formate une date relative (ex: "il y a 2 heures")
 */
export const formatRelativeDate = (timestamp: number): string => {
  return dayjs(timestamp).fromNow();
};

/**
 * Formate une date complète
 */
export const formatDate = (timestamp: number, format: string = 'DD/MM/YYYY'): string => {
  return dayjs(timestamp).format(format);
};

