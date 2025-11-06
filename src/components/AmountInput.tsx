import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  placeholder?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency = 'EUR',
  placeholder = '0,00',
}) => {
  const [displayValue, setDisplayValue] = useState(value > 0 ? value.toFixed(2).replace('.', ',') : '');

  const formatAmount = (input: string): string => {
    // Retirer tout sauf les chiffres et la virgule
    const cleaned = input.replace(/[^\d,]/g, '');
    // Remplacer la virgule par un point pour le calcul
    const normalized = cleaned.replace(',', '.');
    const numValue = parseFloat(normalized) || 0;
    // Formater avec 2 décimales
    return numValue.toFixed(2).replace('.', ',');
  };

  const handleChange = (text: string) => {
    const formatted = formatAmount(text);
    setDisplayValue(formatted);
    const numValue = parseFloat(formatted.replace(',', '.')) || 0;
    onChange(numValue);
  };

  const handleNumberPress = (digit: string) => {
    const newValue = displayValue + digit;
    handleChange(newValue);
  };

  const handleBackspace = () => {
    if (displayValue.length > 0) {
      const newValue = displayValue.slice(0, -1);
      handleChange(newValue);
    }
  };

  const handleClear = () => {
    setDisplayValue('');
    onChange(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.currency}>{currency}</Text>
        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[500]}
          keyboardType="numeric"
          selectTextOnFocus
        />
      </View>

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
        <TouchableOpacity style={styles.key} onPress={handleClear}>
          <Text style={styles.keyText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={() => handleNumberPress('0')}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={() => handleNumberPress(',')}>
          <Text style={styles.keyText}>,</Text>
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
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  currency: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginRight: spacing.sm,
  },
  input: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    textAlign: 'center',
    minWidth: 150,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  key: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.gray[400],
    borderRadius: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  keyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary.light,
  },
});

