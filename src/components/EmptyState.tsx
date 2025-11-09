import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  ctaLabel,
  onCtaPress,
  icon,
}) => {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {ctaLabel && onCtaPress && (
        <Button
          title={ctaLabel}
          onPress={onCtaPress}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  button: {
    marginTop: spacing.md,
  },
});