import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/theme';

interface CategoryChipProps {
  id: string;
  label: string;
  color: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  color,
  icon,
  selected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: selected ? color : colors.gray[400] },
        selected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[
          styles.label,
          { color: selected ? colors.background.light : colors.text.primary.light },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: typography.fontSize.base,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});

