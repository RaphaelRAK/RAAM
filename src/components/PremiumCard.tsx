import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '@/theme';

interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'gradient' | 'solid';
  gradientColors?: string[];
  style?: ViewStyle;
  onPress?: () => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  variant = 'glass',
  gradientColors,
  style,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
      opacity.value = withTiming(0.95);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    }
  };

  const renderContent = () => {
    switch (variant) {
      case 'glass':
        return (
          <View style={styles.glassContainer}>
            <View style={styles.glassContent}>{children}</View>
          </View>
        );
      case 'gradient':
        if (!gradientColors) return null;
        return (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {children}
          </LinearGradient>
        );
      case 'solid':
        return <View style={styles.solid}>{children}</View>;
      default:
        return null;
    }
  };

  const content = (
    <Animated.View style={[styles.container, style]}>
      {onPress ? (
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          style={styles.pressable}
        >
          <Animated.View style={animatedStyle}>
            {renderContent()}
          </Animated.View>
        </Pressable>
      ) : (
        <Animated.View style={animatedStyle}>
          {renderContent()}
        </Animated.View>
      )}
    </Animated.View>
  );

  return content;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
  },
  glassContainer: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[700],
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    // Effet glassmorphism avec ombre
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  glassContent: {
    padding: spacing.lg,
    backgroundColor: 'transparent',
  },
  gradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  solid: {
    backgroundColor: colors.gray[800],
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[700],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
});
