/**
 * Composant CategoryChip - Chip de catégorie avec icône et couleur
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import type { LucideIcon } from 'lucide-react-native';

interface CategoryChipProps {
  id: string;
  label: string;
  color: string;
  icon?: LucideIcon;
  selected?: boolean;
  onPress?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  color,
  icon: Icon,
  selected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: selected ? color : theme.colors.gray[400] },
        selected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {Icon && <Icon size={20} color={selected ? '#FFFFFF' : theme.colors.gray[700]} />}
      <Text
        style={[
          styles.label,
          { color: selected ? '#FFFFFF' : theme.colors.text.primary.light },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minHeight: 44,
  },
  selected: {
    ...theme.shadows.sm,
  },
  label: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

