import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN || "";

/**
 * Initialise Sentry pour le monitoring des erreurs
 */
export const initializeSentry = (): void => {
  if (!SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: false,
    debug: __DEV__,
    environment: Constants.expoConfig?.extra?.env || process.env.EXPO_PUBLIC_ENV || "development",
  });
};

/**
 * Capture une erreur
 */
export const captureException = (error: Error, context?: Record<string, unknown>): void => {
  if (context) {
    Sentry.setContext("error_context", context);
  }
  Sentry.captureException(error);
};

/**
 * Capture un message
 */
export const captureMessage = (message: string, level: Sentry.SeverityLevel = "info"): void => {
  Sentry.captureMessage(message, level);
};

