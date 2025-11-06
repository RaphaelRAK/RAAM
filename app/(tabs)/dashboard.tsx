import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useVaultStore } from "@/store/vault";
import { useTransactionStore } from "@/store/transactions";
import { Card, BudgetRing, TxListItem, EmptyState } from "@/components";
import { colors, spacing, typography, borderRadius } from "@/theme";
import { formatCurrency } from "@/utils/currency";

export default function DashboardScreen() {
  const router = useRouter();
  const { currentVault, loadVaults } = useVaultStore();
  const { transactions, loadTransactions } = useTransactionStore();

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  useEffect(() => {
    if (currentVault) {
      loadTransactions(currentVault.id, 5);
    }
  }, [currentVault, loadTransactions]);

  if (!currentVault) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Aucun portefeuille"
          message="Créez votre premier portefeuille pour commencer"
          ctaLabel="Créer un portefeuille"
          onCtaPress={() => router.push("/vault/create")}
        />
      </View>
    );
  }

  const balance = transactions.reduce((sum, tx) => {
    return sum + (tx.type === "IN" ? tx.amount : -tx.amount);
  }, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget App</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/transaction/add")}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde actuel</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(balance, currentVault.currency)}
        </Text>
      </Card>

      <Card style={styles.budgetCard}>
        <Text style={styles.sectionTitle}>Budget du mois</Text>
        <BudgetRing used={0} total={1000} currency={currentVault.currency} />
      </Card>

      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dernières transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <EmptyState
            title="Aucune transaction"
            message="Ajoutez votre première transaction pour commencer"
            ctaLabel="Ajouter une transaction"
            onCtaPress={() => router.push("/transaction/add")}
          />
        ) : (
          transactions.map((tx) => (
            <TxListItem key={tx.id} transaction={tx} />
          ))
        )}
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
    padding: spacing[4],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[6],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  balanceCard: {
    marginBottom: spacing[6],
  },
  balanceLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
    marginBottom: spacing[2],
  },
  balanceAmount: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    fontVariant: ["tabular-nums"],
  },
  budgetCard: {
    marginBottom: spacing[6],
    alignItems: "center",
  },
  transactionsSection: {
    marginTop: spacing[4],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
});

