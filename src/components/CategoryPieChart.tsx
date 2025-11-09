import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryPie, VictoryTheme } from 'victory-native';
import { colors, spacing, typography } from '@/theme';
import { formatCurrency } from '@/utils/currency';

interface CategoryData {
  name: string;
  amount: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
  currency?: string;
  size?: number;
}

const DEFAULT_COLORS = [
  colors.primary,
  colors.secondary,
  colors.accent,
  colors.info,
  colors.warning,
  colors.error,
  '#8B5CF6',
  '#EC4899',
];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  currency = 'EUR',
  size = 200,
}) => {
  const chartData = data.map((item, index) => ({
    x: item.name,
    y: item.amount,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dépenses par catégorie</Text>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          width={size}
          height={size}
          innerRadius={size * 0.4}
          colorScale={chartData.map((d) => d.color)}
          style={{
            labels: { fill: 'transparent' },
          }}
          theme={VictoryTheme.material}
        />
        <View style={styles.centerText}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(total, currency)}
          </Text>
        </View>
      </View>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length] },
              ]}
            />
            <Text style={styles.legendText}>{item.name}</Text>
            <Text style={styles.legendAmount}>
              {formatCurrency(item.amount, currency)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    marginBottom: spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: spacing.md,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  legend: {
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  legendText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary.light,
    flex: 1,
  },
  legendAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
  },
});

