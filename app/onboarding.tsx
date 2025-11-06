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
  },
});

