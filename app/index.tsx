import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme";

export default function Index() {
  const router = useRouter();
  const { isInitialized, isOnboarded } = useAuthStore();

  useEffect(() => {
    if (isInitialized) {
      if (isOnboarded) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [isInitialized, isOnboarded, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getDatabase } from '@/db';
import { generateMasterKey, saveMasterKey } from '@/utils/crypto';
import { useVaultStore } from '@/store/useVaultStore';

const INITIALIZED_KEY = 'app_initialized';

export default function Index() {
  const router = useRouter();
  const { loadVaults } = useVaultStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Vérifier si l'app est déjà initialisée
        const initialized = await SecureStore.getItemAsync(INITIALIZED_KEY);
        
        if (initialized) {
          // Charger les données et rediriger vers le dashboard
          await loadVaults();
          router.replace('/(tabs)/dashboard');
        } else {
          // Rediriger vers l'onboarding
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        router.replace('/onboarding');
      }
    };

    initializeApp();
  }, [router, loadVaults]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={styles.text}>Chargement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});

