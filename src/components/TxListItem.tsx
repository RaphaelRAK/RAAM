import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from "@/theme";
import { formatCurrency } from "@/utils/currency";
import { formatRelativeDate } from "@/utils/date";
import { Transaction } from "@/types";

interface TxListItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TxListItem: React.FC<TxListItemProps> = ({ transaction, onPress }) => {
  const isIncome = transaction.type === "IN";
  const amountColor = isIncome ? colors.secondary : colors.text.primary.light;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.category}>
            {transaction.category_id || "Sans catégorie"}
          </Text>
          {transaction.note && (
            <Text style={styles.note} numberOfLines={1}>
              {transaction.note}
            </Text>
          )}
          <Text style={styles.date}>{formatRelativeDate(transaction.date)}</Text>
        </View>
        <View style={styles.right}>
          <Text
            style={[
              styles.amount,
              { color: amountColor },
            ]}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[400],
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flex: 1,
    marginRight: spacing[4],
  },
  right: {
    alignItems: "flex-end",
  },
  category: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
    marginBottom: spacing[1],
  },
  note: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
    marginBottom: spacing[1],
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary.light,
  },
  amount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontVariant: ["tabular-nums"],
  },
});

