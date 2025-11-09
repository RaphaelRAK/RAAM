import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, User } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/theme';

interface DashboardHeaderProps {
  userName?: string;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Utilisateur',
  onNotificationPress,
  onAvatarPress,
}) => {
  const firstName = userName.split(' ')[0];

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(180)} style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting}>Bonjour,</Text>
        <Text style={styles.name}>{firstName}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Bell size={22} color={colors.text.primary.light} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAvatarPress}
          style={styles.avatar}
          activeOpacity={0.7}
        >
          <User size={20} color={colors.text.primary.light} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  left: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary.light,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    letterSpacing: -0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.income,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.primary,
  },
});

