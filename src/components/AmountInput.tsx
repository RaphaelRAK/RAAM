import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors, spacing, typography, borderRadius } from "@/theme";
import { formatCurrency, parseAmount, formatAmountForInput } from "@/utils/currency";

interface AmountInputProps {
  value: number;
  onChange: (amount: number) => void;
  currency?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  showCurrency?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency = "EUR",
  style,
  inputStyle,
  showCurrency = true,
}) => {
  const [displayValue, setDisplayValue] = useState(formatAmountForInput(value));

  useEffect(() => {
    setDisplayValue(formatAmountForInput(value));
  }, [value]);

  const handleChange = (text: string) => {
    // Permet seulement les chiffres, point et virgule
    const cleaned = text.replace(/[^0-9,.]/g, "");
    setDisplayValue(cleaned);
    const parsed = parseAmount(cleaned);
    onChange(parsed);
  };

  return (
    <View style={[styles.container, style]}>
      {showCurrency && (
        <Text style={styles.currency}>{currency}</Text>
      )}
      <TextInput
        style={[styles.input, inputStyle]}
        value={displayValue}
        onChangeText={handleChange}
        keyboardType="decimal-pad"
        placeholder="0,00"
        placeholderTextColor={colors.gray[500]}
        selectTextOnFocus
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[400],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 56,
  },
  currency: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary.light,
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    fontVariant: ["tabular-nums"],
  },
});

