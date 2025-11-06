import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const POSTHOG_KEY = Constants.expoConfig?.extra?.posthogKey || process.env.EXPO_PUBLIC_POSTHOG_KEY || "";

let isInitialized = false;

/**
 * Initialise PostHog
 */
export const initializeAnalytics = async (): Promise<void> => {
  if (!POSTHOG_KEY || isInitialized) {
    return;
  }

  try {
    await PostHog.initAsync(POSTHOG_KEY, {
      host: "https://app.posthog.com",
    });
    isInitialized = true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de PostHog:", error);
  }
};

/**
 * Identifie un utilisateur
 */
export const identifyUser = (userId: string, properties?: Record<string, unknown>): void => {
  if (!isInitialized) return;
  PostHog.identify(userId, properties);
};

/**
 * Enregistre un événement
 */
export const trackEvent = (eventName: string, properties?: Record<string, unknown>): void => {
  if (!isInitialized) return;
  PostHog.capture(eventName, properties);
};

/**
 * Événements clés de l'app
 */
export const events = {
  appOpen: () => trackEvent("app_open"),
  onboardingComplete: () => trackEvent("onboarding_complete"),
  txCreated: (type: string, amount: number) =>
    trackEvent("tx_created", { type, amount }),
  budgetCreated: (amount: number, period: string) =>
    trackEvent("budget_created", { amount, period }),
  reminderFired: (type: string) => trackEvent("reminder_fired", { type }),
  paywallView: () => trackEvent("paywall_view"),
  purchaseSuccess: (plan: string) => trackEvent("purchase_success", { plan }),
  restoreFromKey: () => trackEvent("restore_from_key"),
};

