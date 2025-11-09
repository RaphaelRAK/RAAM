import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/auth';
import { useVaultStore } from '@/store/vault';
import { colors } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialize, isInitialized } = useAuthStore();
  const { loadVaults } = useVaultStore();


  useEffect(() => {
    console.log('RootLayout: Initialisation...');
    initialize().catch((error) => {
      console.error('RootLayout: Erreur lors de l\'initialisation:', error);
    });
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      loadVaults();
    }
  }, [isInitialized, loadVaults]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: colors.background.light,
              },
              headerTintColor: colors.text.primary.light,
              headerShadowVisible: false,
              contentStyle: { 
                backgroundColor: colors.background.light 
              },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});