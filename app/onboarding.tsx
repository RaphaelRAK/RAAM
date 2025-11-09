/**
 * Écran d'onboarding - Création instantanée sans compte
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { initializeOnboarding } from '@/services/onboarding';
import { useOnboardingStore } from '@/store/onboardingStore';
import { Button, Card } from '@/components';
import { colors, spacing, typography, borderRadius } from '@/theme';
import QRCodeSVG from 'react-native-qrcode-svg';
import { generateQRData } from '@/utils/qr';
import { formatRecoveryKey } from '@/utils/recovery';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setCompleted } = useOnboardingStore();
  const [step, setStep] = useState<'welcome' | 'recovery' | 'qr'>('welcome');
  const [recoveryKey, setRecoveryKey] = useState<string[]>([]);
  const [deviceId, setDeviceId] = useState<string>('');
  const [vaultId, setVaultId] = useState<string>('');
  const [hasSaved, setHasSaved] = useState(false);

  const handleStart = async () => {
    try {
      const result = await initializeOnboarding();
      setRecoveryKey(result.recoveryKey);
      setDeviceId(result.deviceId);
      setVaultId(result.vaultId);
      setStep('recovery');
    } catch (error) {
      console.error('Error initializing onboarding:', error);
      Alert.alert(
        'Erreur',
        'Impossible de créer votre coffre. Veuillez réessayer.'
      );
    }
  };

  const handleContinue = () => {
    if (!hasSaved) {
      Alert.alert(
        'Important',
        'Vous devez sauvegarder votre clé de récupération avant de continuer. Sans elle, vous perdrez l\'accès à vos données.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'J\'ai sauvegardé', onPress: () => setHasSaved(true) },
        ]
      );
      return;
    }
    setStep('qr');
  };

  const handleFinish = () => {
    setCompleted(true);
    router.replace('/(tabs)/dashboard');
  };

  if (step === 'welcome') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Bienvenue dans Budget</Text>
            <Text style={styles.subtitle}>
              Gérez votre budget simplement et en toute confidentialité
            </Text>
          </View>

          <View style={styles.features}>
            <Text style={styles.feature}>✓ 100% local et sécurisé</Text>
            <Text style={styles.feature}>✓ Aucun compte requis</Text>
            <Text style={styles.feature}>✓ Fonctionne hors ligne</Text>
            <Text style={styles.feature}>✓ Vos données vous appartiennent</Text>
          </View>

          <Button
            title="Commencer sans compte"
            onPress={handleStart}
            variant="primary"
            size="lg"
            style={styles.button}
          />
        </ScrollView>
      </View>
    );
  }

  if (step === 'recovery') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Clé de récupération</Text>
            <Text style={styles.subtitle}>
              Sauvegardez ces 12 mots dans un endroit sûr. Ils vous permettront
              de récupérer vos données en cas de perte de votre appareil.
            </Text>
          </View>

          <Card style={styles.recoveryCard}>
            <Text style={styles.recoveryKey}>
              {formatRecoveryKey(recoveryKey)}
            </Text>
          </Card>

          <TouchableOpacity
            style={styles.copyButton}
            onPress={async () => {
              const recoveryKeyText = formatRecoveryKey(recoveryKey);
              await Clipboard.setStringAsync(recoveryKeyText);
              Alert.alert('Copié', 'La clé de récupération a été copiée dans le presse-papiers');
            }}
          >
            <Text style={styles.copyButtonText}>📋 Copier la clé</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setHasSaved(!hasSaved)}
          >
            <View
              style={[
                styles.checkbox,
                hasSaved && styles.checkboxChecked,
              ]}
            >
              {hasSaved && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              J'ai sauvegardé ma clé de récupération
            </Text>
          </TouchableOpacity>

          <Button
            title="Continuer"
            onPress={handleContinue}
            variant="primary"
            size="lg"
            style={styles.button}
            disabled={!hasSaved}
          />
        </ScrollView>
      </View>
    );
  }

  // Step: QR
  const qrData = deviceId && vaultId ? generateQRData(deviceId, vaultId) : '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Liaison multi-appareils</Text>
          <Text style={styles.subtitle}>
            Scannez ce QR code avec un autre appareil pour synchroniser vos
            données (optionnel)
          </Text>
        </View>

        {qrData && (
          <Card style={styles.qrCard}>
            <QRCodeSVG value={qrData} size={200} />
          </Card>
        )}

        <Button
          title="Terminer"
          onPress={handleFinish}
          variant="primary"
          size="lg"
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary.light,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary.light,
    textAlign: 'center',
    lineHeight: typography.lineHeight.lg,
  },
  features: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  feature: {
    ...typography.body,
    color: colors.text.secondary.light,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.lg,
  },
  recoveryCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  recoveryKey: {
    ...typography.body,
    color: colors.text.primary.light,
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: typography.lineHeight.lg,
  },
  copyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  copyButtonText: {
    ...typography.body,
    color: colors.background.light,
    fontWeight: typography.fontWeight.semibold,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.background.light,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.text.primary.light,
    flex: 1,
  },
  qrCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
});