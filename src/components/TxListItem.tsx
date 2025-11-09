import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDownCircle, ArrowUpCircle, ShoppingBag, Car, Utensils, Film, MoreHorizontal } from "lucide-react-native";
import { colors, spacing, typography, borderRadius } from "@/theme";
import { formatCurrency } from "@/utils/currency";
import { formatRelativeDate } from "@/utils/date";
import { Transaction } from "@/types";

interface TxListItemProps {
  transaction: Transaction;
  onPress?: () => void;
  delay?: number;
}

const getCategoryIcon = (categoryId: string | null) => {
  if (!categoryId) return <MoreHorizontal size={20} color={colors.text.secondary.light} />;
  
  const categoryLower = categoryId.toLowerCase();
  if (categoryLower.includes('aliment') || categoryLower.includes('food')) {
    return <Utensils size={20} color={colors.primary} />;
  }
  if (categoryLower.includes('transport') || categoryLower.includes('car')) {
    return <Car size={20} color={colors.secondary} />;
  }
  if (categoryLower.includes('shop') || categoryLower.includes('shopping')) {
    return <ShoppingBag size={20} color={colors.accent} />;
  }
  if (categoryLower.includes('loisir') || categoryLower.includes('film')) {
    return <Film size={20} color={colors.info} />;
  }
  return <MoreHorizontal size={20} color={colors.text.secondary.light} />;
};

export const TxListItem: React.FC<TxListItemProps> = ({ transaction, onPress, delay = 0 }) => {
  const isIncome = transaction.type === "IN";
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const iconBgColor = isIncome 
    ? [colors.accent.income + '20', colors.accent.income + '10']
    : [colors.accent.expense + '20', colors.accent.expense + '10'];

  return (
    <Animated.View
      entering={FadeInRight.delay(delay).springify()}
      style={styles.container}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
      >
        <Animated.View style={animatedStyle}>
        <View style={styles.content}>
          <View style={styles.left}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={iconBgColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                {isIncome ? (
                  <ArrowUpCircle size={20} color={colors.accent.income} />
                ) : (
                  <ArrowDownCircle size={20} color={colors.accent.expense} />
                )}
              </LinearGradient>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.merchant}>
                {transaction.merchant || transaction.note || "Transaction"}
              </Text>
              {transaction.note && transaction.merchant && (
                <Text style={styles.note} numberOfLines={1}>
                  {transaction.note}
                </Text>
              )}
              <Text style={styles.date}>{formatRelativeDate(transaction.date)}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text
              style={[
                styles.amount,
                { color: isIncome ? colors.accent.positive : colors.accent.expense },
              ]}
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
            </Text>
          </View>
        </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  touchable: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  right: {
    alignItems: "flex-end",
  },
  merchant: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    marginBottom: spacing.xs,
  },
  note: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary.light,
    opacity: 0.7,
  },
  amount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.5,
  },
});

