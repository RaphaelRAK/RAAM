import React from "react";
import { View, Text, StyleSheet } from "react-native";
// Note: VictoryPie nécessite react-native-svg configuré
// Pour l'instant, on utilise un placeholder
import { colors, spacing, typography } from "@/theme";
import { formatCurrency } from "@/utils/currency";

interface BudgetRingProps {
  used: number;
  total: number;
  thresholdMarkers?: number[];
  currency?: string;
}

export const BudgetRing: React.FC<BudgetRingProps> = ({
  used,
  total,
  thresholdMarkers = [50, 80, 100],
  currency = "EUR",
}) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const remaining = Math.max(total - used, 0);

  const getColor = (): string => {
    if (percentage >= thresholdMarkers[2]) return colors.error;
    if (percentage >= thresholdMarkers[1]) return colors.warning;
    if (percentage >= thresholdMarkers[0]) return colors.accent;
    return colors.secondary;
  };

  // TODO: Implémenter avec VictoryPie une fois react-native-svg configuré
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <View style={[styles.ring, { borderColor: getColor() }]}>
          <View style={styles.centerLabel}>
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
            <Text style={styles.amount}>{formatCurrency(used, currency)}</Text>
            <Text style={styles.total}>sur {formatCurrency(total, currency)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  amount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    marginTop: spacing[1],
  },
  total: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
    marginTop: spacing[1],
  },
});

