import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { colors, spacing, typography } from '@/theme';

interface BudgetRingProps {
  used: number;
  total: number;
  thresholdMarkers?: number[];
  size?: number;
  label?: string;
}

export const BudgetRing: React.FC<BudgetRingProps> = ({
  used,
  total,
  thresholdMarkers = [50, 80, 100],
  size = 120,
  label,
}) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const remaining = Math.max(total - used, 0);

  // Déterminer la couleur selon les seuils
  let ringColor = colors.success;
  if (percentage >= thresholdMarkers[2]) {
    ringColor = colors.error;
  } else if (percentage >= thresholdMarkers[1]) {
    ringColor = colors.warning;
  } else if (percentage >= thresholdMarkers[0]) {
    ringColor = colors.accent;
  }

  const data = [
    { x: 'used', y: used },
    { x: 'remaining', y: remaining },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.ringContainer, { width: size, height: size }]}>
        <VictoryPie
          data={data}
          width={size}
          height={size}
          innerRadius={size * 0.35}
          colorScale={[ringColor, colors.gray[400]]}
          style={{
            labels: { fill: 'transparent' },
          }}
        />
        <View style={styles.centerText}>
          <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
          {label && <Text style={styles.label}>{label}</Text>}
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.amount}>
          {used.toFixed(2)} / {total.toFixed(2)}
        </Text>
        <Text style={styles.remaining}>Reste: {remaining.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
  },
  ringContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentage: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary.light,
    marginTop: spacing.xs,
  },
  info: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  amount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
  },
  remaining: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
    marginTop: spacing.xs,
  },
});

