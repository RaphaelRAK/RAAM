import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { formatCurrency } from '@/utils/currency';

interface CategoryBudgetCardProps {
  name: string;
  icon?: string | React.ReactNode;
  spent: number;
  budget: number;
  currency?: string;
  delay?: number;
  onPress?: () => void;
}

export const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  name,
  icon,
  spent,
  budget,
  currency = 'EUR',
  delay = 0,
  onPress,
}) => {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
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

  // Déterminer la couleur de la barre selon le pourcentage
  let progressColor: string[];
  if (percentage >= 100) {
    progressColor = ['#F87171', '#EF4444']; // Rouge
  } else if (percentage >= 80) {
    progressColor = ['#FBBF24', '#F59E0B']; // Jaune
  } else {
    progressColor = ['#4ADE80', '#22C55E']; // Vert
  }

  return (
    <Animated.View
      entering={FadeInRight.delay(delay).duration(180)}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.card}
      >
        <Animated.View style={animatedStyle}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              {typeof icon === 'string' ? (
                <Text style={styles.emoji}>{icon}</Text>
              ) : (
                icon
              )}
            </View>
            <Text style={styles.categoryName} numberOfLines={1}>
              {name}
            </Text>
          </View>

          <View style={styles.amounts}>
            <Text style={styles.spent}>
              {formatCurrency(spent, currency)}
            </Text>
            <Text style={styles.budget}>
              / {formatCurrency(budget, currency)}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={progressColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${Math.min(percentage, 100)}%` }]}
              />
            </View>
            <Text style={styles.percentage}>
              {Math.round(percentage)}%
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  categoryName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
  },
  amounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  spent: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    fontVariant: ['tabular-nums'],
  },
  budget: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.tertiary.light,
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surface.secondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  percentage: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary.light,
    minWidth: 40,
    textAlign: 'right',
  },
});

