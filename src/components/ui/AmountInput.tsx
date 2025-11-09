/**
 * Composant AmountInput - Pavé numérique pour montants
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/theme';
import { formatAmount, parseAmountInput } from '@/utils/format';
import type { Currency } from '@/types';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: Currency;
  placeholder?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency = 'EUR',
  placeholder = '0,00',
}) => {
  const [displayValue, setDisplayValue] = useState(
    value > 0 ? formatAmount(value, currency) : ''
  );

  const handleTextChange = useCallback(
    (text: string) => {
      setDisplayValue(text);
      const parsed = parseAmountInput(text);
      onChange(parsed);
    },
    [onChange]
  );

  const handleNumberPress = useCallback(
    (num: string) => {
      const current = displayValue.replace(/[^\d,]/g, '').replace(',', '.');
      const newValue = current === '0' ? num : current + num;
      handleTextChange(newValue);
    },
    [displayValue, handleTextChange]
  );

  const handleDecimal = useCallback(() => {
    if (!displayValue.includes(',')) {
      handleTextChange(displayValue + ',');
    }
  }, [displayValue, handleTextChange]);

  const handleBackspace = useCallback(() => {
    if (displayValue.length > 0) {
      handleTextChange(displayValue.slice(0, -1));
    }
  }, [displayValue, handleTextChange]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={displayValue}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray[500]}
        keyboardType="numeric"
        selectTextOnFocus
      />
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.key}
            onPress={() => handleNumberPress(num.toString())}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key} onPress={handleDecimal}>
          <Text style={styles.keyText}>,</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={() => handleNumberPress('0')}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={handleBackspace}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary.light,
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  key: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.gray[400],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    minHeight: 44,
  },
  keyText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary.light,
  },
});

