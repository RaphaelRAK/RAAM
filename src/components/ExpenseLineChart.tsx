import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryArea, VictoryTheme } from 'victory-native';
import { colors, spacing, typography } from '@/theme';
import { formatCurrency } from '@/utils/currency';

interface ExpenseLineChartProps {
  data: { x: string; y: number }[];
  currency?: string;
  height?: number;
}

export const ExpenseLineChart: React.FC<ExpenseLineChartProps> = ({
  data,
  currency = 'EUR',
  height = 200,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - spacing.lg * 2 - spacing.md * 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Évolution des dépenses</Text>
      <View style={styles.chartContainer}>
        <VictoryChart
          width={chartWidth}
          height={height}
          theme={VictoryTheme.material}
          padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: colors.gray[600] },
              tickLabels: { fill: colors.text.secondary.light, fontSize: 10, fontFamily: 'System' },
              grid: { stroke: colors.gray[700], strokeDasharray: '4,4', strokeOpacity: 0.3 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.gray[600] },
              tickLabels: { fill: colors.text.secondary.light, fontSize: 10, fontFamily: 'System' },
              grid: { stroke: colors.gray[700], strokeDasharray: '4,4', strokeOpacity: 0.3 },
            }}
            tickFormat={(t) => `${(t / 1000).toFixed(0)}k`}
          />
          <VictoryArea
            data={data}
            style={{
              data: {
                fill: colors.accent.expense,
                fillOpacity: 0.15,
                stroke: 'transparent',
              },
            }}
          />
          <VictoryLine
            data={data}
            style={{
              data: {
                stroke: colors.accent.expense,
                strokeWidth: 3,
                strokeLinecap: 'round',
              },
            }}
            interpolation="monotoneX"
          />
        </VictoryChart>
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
  },
});

