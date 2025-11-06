import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure le comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Demande les permissions de notification
 */
export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4F46E5",
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

/**
 * Planifie une notification locale
 */
export const scheduleNotification = async (
  identifier: string,
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput
): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title,
        body,
        sound: true,
      },
      trigger,
    });
    return notificationId;
  } catch (error) {
    console.error("Erreur lors de la planification de la notification:", error);
    return null;
  }
};

/**
 * Annule une notification planifiée
 */
export const cancelNotification = async (identifier: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(identifier);
};

/**
 * Annule toutes les notifications planifiées
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Obtient toutes les notifications planifiées
 */
export const getAllScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

/**
 * Planifie une notification récurrente (ex: tous les jours à 20h)
 */
export const scheduleRecurringNotification = async (
  identifier: string,
  title: string,
  body: string,
  hour: number,
  minute: number = 0
): Promise<string | null> => {
  return await scheduleNotification(identifier, title, body, {
    hour,
    minute,
    repeats: true,
  });
};

