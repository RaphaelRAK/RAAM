/**
 * Composant EmptyState - État vide avec CTA
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  ctaLabel,
  onCtaPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {ctaLabel && onCtaPress && (
        <Button title={ctaLabel} onPress={onCtaPress} variant="primary" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary.light,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary.light,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.base,
  },
});

