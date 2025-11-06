import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.locale("fr");

/**
 * Formate une date relative (ex: "il y a 2 heures")
 */
export const formatRelativeDate = (timestamp: number): string => {
  return dayjs(timestamp).fromNow();
};

/**
 * Formate une date complète
 */
export const formatDate = (timestamp: number, format: string = "DD/MM/YYYY"): string => {
  return dayjs(timestamp).format(format);
};

/**
 * Obtient le timestamp du début du jour
 */
export const getStartOfDay = (timestamp: number): number => {
  return dayjs(timestamp).startOf("day").valueOf();
};

/**
 * Obtient le timestamp de la fin du jour
 */
export const getEndOfDay = (timestamp: number): number => {
  return dayjs(timestamp).endOf("day").valueOf();
};

/**
 * Obtient le timestamp du début du mois
 */
export const getStartOfMonth = (timestamp: number): number => {
  return dayjs(timestamp).startOf("month").valueOf();
};

/**
 * Obtient le timestamp de la fin du mois
 */
export const getEndOfMonth = (timestamp: number): number => {
  return dayjs(timestamp).endOf("month").valueOf();
};

