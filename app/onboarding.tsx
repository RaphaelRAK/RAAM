import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components";
import { colors, spacing, typography, borderRadius } from "@/theme";
import { generateRecoveryKey } from "@/services/recovery";
// QRCode sera implémenté plus tard avec react-native-qrcode-svg

export default function OnboardingScreen() {
  const router = useRouter();
  const { createUser } = useAuthStore();
  const [step, setStep] = useState<"welcome" | "key" | "confirm">("welcome");
  const [recoveryKey, setRecoveryKey] = useState<string[]>([]);
  const [hasSaved, setHasSaved] = useState(false);

  const handleStart = async () => {
    try {
      const { recoveryKey: key } = await createUser();
      setRecoveryKey(key);
      setStep("key");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer votre compte. Réessayez.");
    }
  };

  const handleContinue = () => {
    if (!hasSaved) {
      Alert.alert(
        "Attention",
        "Assurez-vous d'avoir sauvegardé votre clé de récupération. Sans elle, vous perdrez l'accès à vos données.",
        [
          { text: "Retour", style: "cancel" },
          {
            text: "Continuer quand même",
            onPress: () => {
              setStep("confirm");
            },
          },
        ]
      );
    } else {
      setStep("confirm");
    }
  };

  const handleConfirm = () => {
    router.replace("/(tabs)/dashboard");
  };

  if (step === "welcome") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Bienvenue dans Budget App</Text>
          <Text style={styles.message}>
            Gérez votre budget en toute simplicité, sans compte email requis.
            Vos données sont stockées localement et chiffrées.
          </Text>
          <Button
            title="Commencer sans compte"
            onPress={handleStart}
            variant="primary"
            size="lg"
            style={styles.button}
          />
        </View>
      </ScrollView>
    );
  }

  if (step === "key") {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Votre clé de récupération</Text>
          <Text style={styles.message}>
            Sauvegardez ces 12 mots dans un endroit sûr. Vous en aurez besoin
            pour récupérer vos données.
          </Text>

          <View style={styles.keyContainer}>
            {recoveryKey.map((word, index) => (
              <View key={index} style={styles.keyWord}>
                <Text style={styles.keyNumber}>{index + 1}</Text>
                <Text style={styles.keyText}>{word}</Text>
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getDatabase } from '@/db';
import { generateMasterKey, saveMasterKey } from '@/utils/crypto';
import { generateMnemonic } from '@/utils/mnemonic';
import { useVaultStore } from '@/store/useVaultStore';
import { colors, spacing, typography, borderRadius } from '@/theme';
import QRCode from 'react-native-qrcode-svg';

const INITIALIZED_KEY = 'app_initialized';
const DEVICE_ID_KEY = 'device_id';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const { createVault } = useVaultStore();

  const handleStart = async () => {
    try {
      // Générer la clé maître
      const masterKey = generateMasterKey();
      await saveMasterKey(masterKey);

      // Générer le mnémonique
      const mnemonicPhrase = generateMnemonic();
      setMnemonic(mnemonicPhrase);

      // Générer l'ID du device
      const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);

      // Préparer les données QR
      const qrPayload = JSON.stringify({
        deviceId,
        mnemonic: mnemonicPhrase,
        timestamp: Date.now(),
      });
      setQrData(qrPayload);

      setStep(2);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      Alert.alert('Erreur', 'Impossible d\'initialiser l\'application');
    }
  };

  const handleContinue = async () => {
    if (!confirmed) {
      Alert.alert('Attention', 'Veuillez confirmer avoir sauvegardé votre clé de récupération');
      return;
    }

    try {
      // Initialiser la base de données
      const db = await getDatabase();

      // Créer l'utilisateur local
      const deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
      if (deviceId) {
        await db.runAsync(
          'INSERT OR REPLACE INTO user_local (id_device, created_at, recovery_hint) VALUES (?, ?, ?)',
          [deviceId, Date.now(), mnemonic || '']
        );
      }

      // Créer un vault par défaut
      await createVault({
        name: 'Mon Portefeuille',
        currency: 'EUR',
        is_default: 1,
      });

      // Marquer l'app comme initialisée
      await SecureStore.setItemAsync(INITIALIZED_KEY, 'true');

      // Rediriger vers le dashboard
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      Alert.alert('Erreur', 'Impossible de finaliser l\'initialisation');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {step === 1 && (
        <View style={styles.step}>
          <Text style={styles.title}>Bienvenue dans Budget App</Text>
          <Text style={styles.description}>
            Gérez vos finances en toute confidentialité. Vos données restent locales et chiffrées.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Commencer sans compte</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && mnemonic && (
        <View style={styles.step}>
          <Text style={styles.title}>Sauvegardez votre clé de récupération</Text>
          <Text style={styles.description}>
            Cette clé vous permettra de récupérer vos données. Conservez-la en lieu sûr.
          </Text>

          <View style={styles.mnemonicContainer}>
            {mnemonic.split(' ').map((word, index) => (
              <View key={index} style={styles.wordChip}>
                <Text style={styles.wordNumber}>{index + 1}</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setHasSaved(!hasSaved)}
          >
            <View
              style={[
                styles.checkboxBox,
                hasSaved && styles.checkboxBoxChecked,
              ]}
            >
              {hasSaved && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
          {qrData && (
            <View style={styles.qrContainer}>
              <Text style={styles.qrLabel}>QR Code de liaison</Text>
              <QRCode value={qrData} size={200} />
            </View>
          )}

          <TouchableOpacity
            style={[styles.checkbox, confirmed && styles.checkboxChecked]}
            onPress={() => setConfirmed(!confirmed)}
          >
            <Text style={styles.checkboxText}>
              J'ai sauvegardé ma clé de récupération
            </Text>
          </TouchableOpacity>

          <Button
            title="Continuer"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            style={styles.button}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>C'est prêt !</Text>
        <Text style={styles.message}>
          Votre compte a été créé. Vous pouvez maintenant commencer à gérer votre
          budget.
        </Text>
        <Button
          title="Commencer"
          onPress={handleConfirm}
          variant="primary"
          size="lg"
          style={styles.button}
        />
      </View>
          <TouchableOpacity
            style={[styles.button, !confirmed && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!confirmed}
          >
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    flex: 1,
    padding: spacing[6],
    justifyContent: "center",
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginBottom: spacing[4],
    textAlign: "center",
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary.light,
    marginBottom: spacing[8],
    textAlign: "center",
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  button: {
    marginTop: spacing[6],
  },
  keyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing[6],
    padding: spacing[4],
    backgroundColor: colors.gray[400],
    borderRadius: borderRadius.md,
  },
  keyWord: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: spacing[2],
    padding: spacing[2],
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.sm,
  },
  keyNumber: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.secondary.light,
    marginRight: spacing[2],
    minWidth: 20,
  },
  keyText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary.light,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[4],
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    marginRight: spacing[2],
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.text.primary.light,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  checkboxLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary.light,
    flex: 1,
    flex: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  step: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary.light,
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  mnemonicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.gray[400],
    borderRadius: borderRadius.lg,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    margin: spacing.xs,
    minWidth: 100,
  },
  wordNumber: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary.light,
    marginRight: spacing.xs,
    fontWeight: typography.fontWeight.bold,
  },
  word: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary.light,
    fontWeight: typography.fontWeight.medium,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.lg,
  },
  qrLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
    marginBottom: spacing.md,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray[600],
    borderRadius: borderRadius.md,
    minHeight: 44,
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  checkboxText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary.light,
    marginLeft: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 44,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.gray[500],
    opacity: 0.5,
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.light,
  },
});

