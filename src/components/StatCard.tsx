import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '@/theme';
import { formatCurrency } from '@/utils/currency';

interface StatCardProps {
  label: string;
  amount: number;
  currency?: string;
  gradient: string[];
  icon?: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  amount,
  currency = 'EUR',
  gradient,
  icon,
  delay = 0,
  style,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[styles.container, style]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.amount}>
                  {formatCurrency(amount, currency)}
                </Text>
              </View>
            </View>
            {/* Effet de lumière subtil */}
            <View style={styles.lightEffect} />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
  },
  gradient: {
    padding: spacing.lg,
    minHeight: 140,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  content: {
    zIndex: 2,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  textContainer: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary.light,
    opacity: 0.9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  lightEffect: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
});

