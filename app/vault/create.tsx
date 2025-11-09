import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useVaultStore } from "@/store/vault";
import { Button, Card } from "@/components";
import { colors, spacing, typography, borderRadius } from "@/theme";

const CURRENCIES = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "Dollar US" },
  { code: "GBP", symbol: "£", name: "Livre Sterling" },
  { code: "CHF", symbol: "CHF", name: "Franc Suisse" },
];

export default function CreateVaultScreen() {
  const router = useRouter();
  const { createVault, loadVaults } = useVaultStore();
  const [name, setName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom pour votre portefeuille");
      return;
    }

    setLoading(true);
    try {
      await createVault(name.trim(), selectedCurrency);
      await loadVaults();
      router.back();
    } catch (error) {
      console.error("Erreur lors de la création du portefeuille:", error);
      Alert.alert(
        "Erreur",
        "Impossible de créer le portefeuille. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Créer un portefeuille</Text>
        <Text style={styles.subtitle}>
          Un portefeuille vous permet d'organiser vos budgets et transactions
        </Text>
      </View>

      <Card style={styles.formCard}>
        <View style={styles.field}>
          <Text style={styles.label}>Nom du portefeuille</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Budget personnel"
            placeholderTextColor={colors.text.secondary.light}
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={50}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Devise</Text>
          <View style={styles.currencyGrid}>
            {CURRENCIES.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  selectedCurrency === currency.code &&
                    styles.currencyOptionSelected,
                ]}
                onPress={() => setSelectedCurrency(currency.code)}
              >
                <Text
                  style={[
                    styles.currencySymbol,
                    selectedCurrency === currency.code &&
                      styles.currencySymbolSelected,
                  ]}
                >
                  {currency.symbol}
                </Text>
                <Text
                  style={[
                    styles.currencyCode,
                    selectedCurrency === currency.code &&
                      styles.currencyCodeSelected,
                  ]}
                >
                  {currency.code}
                </Text>
                <Text
                  style={[
                    styles.currencyName,
                    selectedCurrency === currency.code &&
                      styles.currencyNameSelected,
                  ]}
                >
                  {currency.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Annuler"
          onPress={() => router.back()}
          variant="outline"
          size="lg"
          style={styles.cancelButton}
        />
        <Button
          title="Créer"
          onPress={handleCreate}
          variant="primary"
          size="lg"
          loading={loading}
          disabled={loading || !name.trim()}
          style={styles.createButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary.light,
    lineHeight: typography.lineHeight.relaxed,
  },
  formCard: {
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary.light,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  input: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary.light,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.gray[400],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  currencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  currencyOption: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.background.light,
    borderWidth: 2,
    borderColor: colors.gray[400],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  currencyOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  currencySymbol: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginBottom: spacing.xs,
  },
  currencySymbolSelected: {
    color: colors.primary,
  },
  currencyCode: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary.light,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  currencyCodeSelected: {
    color: colors.primary,
  },
  currencyName: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
  },
  currencyNameSelected: {
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
});

