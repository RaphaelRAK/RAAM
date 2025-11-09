import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useVaultStore } from "@/store/vault";
import { useTransactionStore } from "@/store/transactions";
import {
  DashboardHeader,
  BalanceCard,
  ExpenseLineChart,
  CategoryBudgetCard,
  TxListItem,
  EmptyState,
  PremiumCard,
} from "@/components";
import { colors, spacing, typography, borderRadius } from "@/theme";
import { formatCurrency } from "@/utils/currency";
import dayjs from "dayjs";

// Données mockées pour les graphiques
const generateMockExpenseData = (period: 'week' | 'month' | 'year') => {
  const data = [];
  const now = dayjs();
  
  if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const date = now.subtract(i, 'day');
      data.push({
        x: date.format('DD/MM'),
        y: Math.floor(Math.random() * 500) + 200,
      });
    }
  } else if (period === 'month') {
    for (let i = 11; i >= 0; i--) {
      const date = now.subtract(i, 'week');
      data.push({
        x: date.format('DD/MM'),
        y: Math.floor(Math.random() * 2000) + 1000,
      });
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const date = now.subtract(i, 'month');
      data.push({
        x: date.format('MMM'),
        y: Math.floor(Math.random() * 10000) + 5000,
      });
    }
  }
  
  return data;
};

const generateMockCategoryBudgets = () => [
  { name: 'Nourriture', icon: '🍽', spent: 450, budget: 600 },
  { name: 'Transport', icon: '🚗', spent: 320, budget: 400 },
  { name: 'Shopping', icon: '🛍', spent: 280, budget: 350 },
  { name: 'Loisirs', icon: '🎬', spent: 150, budget: 200 },
  { name: 'Santé', icon: '💊', spent: 80, budget: 150 },
];

const generateMockTransactions = () => [
  {
    id: '1',
    vault_id: 'mock',
    type: 'OUT' as const,
    amount: 14.90,
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
    amount: 9.99,
    currency: 'EUR',
    category_id: '2',
    note: 'Abonnement',
    date: Date.now() - 172800000,
    photo_uri: null,
    merchant: 'Spotify',
    recurrence_rule: null,
    created_at: Date.now() - 172800000,
    updated_at: Date.now() - 172800000,
    is_archived: 0,
  },
  {
    id: '3',
    vault_id: 'mock',
    type: 'IN' as const,
    amount: 1280,
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
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  useEffect(() => {
    if (currentVault) {
      loadTransactions(currentVault.id, 5);
    }
  }, [currentVault, loadTransactions]);

  // Données mockées
  const mockExpenseData = useMemo(() => generateMockExpenseData(period), [period]);
  const mockCategoryBudgets = useMemo(() => generateMockCategoryBudgets(), []);
  const mockTransactions = useMemo(() => generateMockTransactions(), []);

  // Calculs
  const currency = currentVault?.currency || 'EUR';
  const totalExpenses = mockCategoryBudgets.reduce((sum, cat) => sum + cat.spent, 0);
  const totalIncome = 1280; // Mock
  const balance = totalIncome - totalExpenses;
  const variation = 150; // Mock variation du mois
  const displayedTransactions = transactions.length > 0 ? transactions : mockTransactions;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <DashboardHeader
          userName="Jean Dupont"
          onNotificationPress={() => {}}
          onAvatarPress={() => {}}
        />

        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          variation={variation}
          currency={currency}
          onAddExpense={() => router.push("/transaction/add")}
          onAddIncome={() => router.push("/transaction/add")}
        />

        {/* Graphique principal avec sélecteur de période */}
        <Animated.View entering={FadeInDown.delay(300).duration(180)}>
          <PremiumCard variant="glass" style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Dépenses / Revenus</Text>
              <View style={styles.periodSelector}>
                {(['week', 'month', 'year'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPeriod(p)}
                    style={[
                      styles.periodButton,
                      period === p && styles.periodButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        period === p && styles.periodButtonTextActive,
                      ]}
                    >
                      {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <ExpenseLineChart data={mockExpenseData} currency={currency} />
          </PremiumCard>
        </Animated.View>

        {/* Mini-cards Budget par catégorie */}
        <Animated.View entering={FadeInDown.delay(400).duration(180)}>
          <View style={styles.budgetsSection}>
            <Text style={styles.sectionTitle}>Budget par catégorie</Text>
            {mockCategoryBudgets.map((category, index) => (
              <CategoryBudgetCard
                key={index}
                name={category.name}
                icon={category.icon}
                spent={category.spent}
                budget={category.budget}
                currency={currency}
                delay={500 + index * 100}
                onPress={() => {}}
              />
            ))}
          </View>
        </Animated.View>

        {/* Liste des transactions récentes */}
        <Animated.View entering={FadeInDown.delay(600).duration(180)} style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
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
            <View style={styles.transactionsList}>
              {displayedTransactions.map((tx, index) => (
                <TxListItem
                  key={tx.id}
                  transaction={tx}
                  delay={700 + index * 100}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl * 2,
  },
  chartCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  chartHeader: {
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    marginBottom: spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  periodButtonActive: {
    backgroundColor: colors.accent.income,
    borderColor: colors.accent.income,
  },
  periodButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary.light,
  },
  periodButtonTextActive: {
    color: colors.text.primary.light,
  },
  budgetsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  transactionsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.accent.income,
    fontWeight: typography.fontWeight.semibold,
  },
  transactionsList: {
    gap: spacing.xs,
  },
});
