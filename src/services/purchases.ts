import Purchases, { CustomerInfo, PurchasesOffering } from "react-native-purchases";
import Constants from "expo-constants";
import { Platform } from "react-native";

const REVENUECAT_API_KEY_IOS = Constants.expoConfig?.extra?.revenuecatApiKeyIos || process.env.REVENUECAT_API_KEY_IOS || "";
const REVENUECAT_API_KEY_ANDROID = Constants.expoConfig?.extra?.revenuecatApiKeyAndroid || process.env.REVENUECAT_API_KEY_ANDROID || "";

let isInitialized = false;

/**
 * Initialise RevenueCat
 */
export const initializePurchases = async (userId: string): Promise<void> => {
  if (isInitialized) {
    return;
  }

  const apiKey = Platform.OS === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

  if (!apiKey) {
    console.warn("RevenueCat API key non configurée");
    return;
  }

  try {
    await Purchases.configure({ apiKey });
    await Purchases.logIn(userId);
    isInitialized = true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de RevenueCat:", error);
  }
};

/**
 * Obtient les offres disponibles
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  if (!isInitialized) return null;

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error("Erreur lors de la récupération des offres:", error);
    return null;
  }
};

/**
 * Vérifie si l'utilisateur a un abonnement Premium
 */
export const isPremium = async (): Promise<boolean> => {
  if (!isInitialized) return false;

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active["premium"] !== undefined;
  } catch (error) {
    console.error("Erreur lors de la vérification du statut Premium:", error);
    return false;
  }
};

/**
 * Achete un produit
 */
export const purchasePackage = async (packageId: string): Promise<CustomerInfo | null> => {
  if (!isInitialized) return null;

  try {
    const offerings = await Purchases.getOfferings();
    const packageToPurchase = offerings.current?.availablePackages.find(
      (pkg) => pkg.identifier === packageId
    );

    if (!packageToPurchase) {
      throw new Error("Package non trouvé");
    }

    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  } catch (error) {
    console.error("Erreur lors de l'achat:", error);
    return null;
  }
};

/**
 * Restaure les achats
 */
export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  if (!isInitialized) return null;

  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error("Erreur lors de la restauration des achats:", error);
    return null;
  }
};

