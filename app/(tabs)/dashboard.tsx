import { useEffect, useMemo } from "react";
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
import { Card, BudgetRing, TxListItem, EmptyState, ExpenseLineChart, CategoryPieChart } from "@/components";
import { colors, spacing, typography, borderRadius } from "@/theme";
import { formatCurrency } from "@/utils/currency";
import dayjs from "dayjs";

// Données mockées pour les graphiques
const generateMockExpenseData = () => {
  const days = [];
  const now = dayjs();
  for (let i = 6; i >= 0; i--) {
    const date = now.subtract(i, 'day');
    days.push({
      x: date.format('DD/MM'),
      y: Math.floor(Math.random() * 500) + 200,
    });
  }
  return days;
};

const generateMockCategoryData = () => [
  { name: 'Alimentation', amount: 450, color: colors.primary },
  { name: 'Transport', amount: 320, color: colors.secondary },
  { name: 'Shopping', amount: 280, color: colors.accent },
  { name: 'Loisirs', amount: 150, color: colors.info },
  { name: 'Autres', amount: 100, color: colors.gray[500] },
];

const generateMockTransactions = () => [
  {
    id: '1',
    vault_id: 'mock',
    type: 'OUT' as const,
    amount: 45.50,
    currency: 'EUR',
    category_id: '1',
    note: 'Courses supermarché',
    date: Date.now() - 86400000,
    photo_uri: null,
    merchant: 'Carrefour',
    recurrence_rule: null,
    created_at: Date.now() - 86400000,
    updated_at: Date.now() - 86400000,
    is_archived: 0,
  },
  {
    id: '2',
    vault_id: 'mock',
    type: 'OUT' as const,
    amount: 28.90,
    currency: 'EUR',
    category_id: '2',
    note: 'Essence',
    date: Date.now() - 172800000,
    photo_uri: null,
    merchant: 'Total',
    recurrence_rule: null,
    created_at: Date.now() - 172800000,
    updated_at: Date.now() - 172800000,
    is_archived: 0,
  },
  {
    id: '3',
    vault_id: 'mock',
    type: 'IN' as const,
    amount: 1500,
    currency: 'EUR',
    category_id: null,
    note: 'Salaire',
    date: Date.now() - 259200000,
    photo_uri: null,
    merchant: null,
    recurrence_rule: null,
    created_at: Date.now() - 259200000,
    updated_at: Date.now() - 259200000,
    is_archived: 0,
  },
];

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

  // Données mockées
  const mockExpenseData = useMemo(() => generateMockExpenseData(), []);
  const mockCategoryData = useMemo(() => generateMockCategoryData(), []);
  const mockTransactions = useMemo(() => generateMockTransactions(), []);

  // Calculs
  const currency = currentVault?.currency || 'EUR';
  const totalExpenses = mockCategoryData.reduce((sum, cat) => sum + cat.amount, 0);
  const totalIncome = 1500; // Mock
  const balance = totalIncome - totalExpenses;
  const displayedTransactions = transactions.length > 0 ? transactions : mockTransactions;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour 👋</Text>
          <Text style={styles.title}>Tableau de bord</Text>
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (currentVault) {
              router.push("/transaction/add");
            } else {
              router.push("/vault/create");
            }
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Statistiques principales */}
      <View style={styles.statsRow}>
        <Card style={[styles.statCard, styles.statCardPrimary]}>
          <Text style={styles.statLabel}>Solde</Text>
          <Text style={styles.statAmount}>
            {formatCurrency(balance, currency)}
          </Text>
        </Card>
        <Card style={[styles.statCard, styles.statCardSecondary]}>
          <Text style={styles.statLabel}>Dépenses</Text>
          <Text style={styles.statAmount}>
            {formatCurrency(totalExpenses, currency)}
          </Text>
        </Card>
      </View>

      {/* Graphique d'évolution */}
      <Card style={styles.chartCard}>
        <ExpenseLineChart data={mockExpenseData} currency={currency} />
      </Card>

      {/* Graphique par catégorie */}
      <Card style={styles.chartCard}>
        <CategoryPieChart data={mockCategoryData} currency={currency} />
      </Card>

      {/* Budget du mois */}
      {currentVault && (
        <Card style={styles.budgetCard}>
          <Text style={styles.sectionTitle}>Budget du mois</Text>
          <BudgetRing 
            used={totalExpenses} 
            total={2000} 
            currency={currency} 
          />
        </Card>
      )}

      {/* Dernières transactions */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dernières transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {displayedTransactions.length === 0 ? (
          <EmptyState
            title="Aucune transaction"
            message="Ajoutez votre première transaction pour commencer"
            ctaLabel="Ajouter une transaction"
            onCtaPress={() => {
              if (currentVault) {
                router.push("/transaction/add");
              } else {
                router.push("/vault/create");
              }
            }}
          />
        ) : (
          displayedTransactions.map((tx) => (
            <TxListItem key={tx.id} transaction={tx} />
          ))
        )}
      </View>

      {/* CTA pour créer un portefeuille si nécessaire */}
      {!currentVault && (
        <Card style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Créez votre premier portefeuille</Text>
          <Text style={styles.ctaMessage}>
            Pour commencer à suivre vos dépenses et revenus
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/vault/create")}
          >
            <Text style={styles.ctaButtonText}>Créer un portefeuille</Text>
          </TouchableOpacity>
        </Card>
      )}
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
  greeting: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary.light,
    marginBottom: spacing.xs,
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
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.lg,
  },
  statCardPrimary: {
    backgroundColor: colors.primary,
  },
  statCardSecondary: {
    backgroundColor: colors.secondary,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.background.light,
    marginBottom: spacing.xs,
    opacity: 0.9,
  },
  statAmount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.background.light,
    fontVariant: ["tabular-nums"],
  },
  chartCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  ctaCard: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    alignItems: "center",
    backgroundColor: colors.gray[400],
  },
  ctaTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  ctaMessage: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary.light,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  ctaButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.light,
  },
});

