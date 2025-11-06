import { View, Text, StyleSheet } from "react-native";
import { EmptyState } from "@/components";
import { colors, spacing, typography } from "@/theme";

export default function BudgetsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budgets</Text>
      </View>
      <EmptyState
        title="Fonctionnalité à venir"
        message="La gestion des budgets sera disponible prochainement"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[400],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
});

