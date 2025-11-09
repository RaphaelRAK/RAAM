import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { formatCurrency } from '@/utils/currency';

interface BalanceCardProps {
  balance: number;
  variation: number; // Variation du mois (positif ou négatif)
  currency?: string;
  onAddExpense?: () => void;
  onAddIncome?: () => void;
  delay?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  variation,
  currency = 'EUR',
  onAddExpense,
  onAddIncome,
  delay = 200,
}) => {
  const isPositive = variation >= 0;
  const variationColor = isPositive ? colors.accent.positive : colors.accent.expense;
  const variationIcon = isPositive ? TrendingUp : TrendingDown;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const VariationIcon = variationIcon;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(180)}
      style={styles.container}
    >
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={colors.gradients.balance}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.balanceSection}>
              <Text style={styles.label}>Solde total</Text>
              <Text style={styles.balance}>
                {formatCurrency(balance, currency)}
              </Text>
              <View style={styles.variationContainer}>
                <VariationIcon
                  size={14}
                  color={variationColor}
                  strokeWidth={2.5}
                />
                <Text style={[styles.variation, { color: variationColor }]}>
                  {isPositive ? '+' : ''}
                  {formatCurrency(Math.abs(variation), currency)}
                </Text>
                <Text style={styles.variationPeriod}> ce mois</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={onAddExpense}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.actionButton, styles.expenseButton]}
                activeOpacity={0.8}
              >
                <Plus size={18} color={colors.text.primary.light} strokeWidth={2.5} />
                <Text style={styles.actionButtonText}>Dépense</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onAddIncome}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.actionButton, styles.incomeButton]}
                activeOpacity={0.8}
              >
                <Plus size={18} color={colors.text.primary.light} strokeWidth={2.5} />
                <Text style={styles.actionButtonText}>Revenu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  gradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    gap: spacing.xl,
  },
  balanceSection: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary.light,
    letterSpacing: 0.5,
  },
  balance: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  variation: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
  variationPeriod: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.tertiary.light,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    shadowColor: colors.shadow.button,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  expenseButton: {
    backgroundColor: colors.accent.expense,
  },
  incomeButton: {
    backgroundColor: colors.accent.income,
  },
  actionButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
  },
});

