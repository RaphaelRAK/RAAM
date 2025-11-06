import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useAuthStore } from "@/store/auth";
import { useVaultStore } from "@/store/vault";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colors } from "@/theme";
import { initializeSentry } from "@/services/sentry";
import { initializeAnalytics } from "@/services/analytics";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialize, isInitialized } = useAuthStore();
  const { loadVaults } = useVaultStore();

  // Initialisation des services au démarrage
  useEffect(() => {
    initializeSentry();
    initializeAnalytics();
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      loadVaults();
    }
  }, [isInitialized, loadVaults]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? colors.background.dark : colors.background.light,
          },
          headerTintColor: colorScheme === "dark" ? colors.text.primary.dark : colors.text.primary.light,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}

