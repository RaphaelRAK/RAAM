import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, borderRadius } from "@/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "glass" | "gradient";
  gradientColors?: string[];
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
  gradientColors,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case "glass":
        return styles.glassCard;
      case "gradient":
        return [
          styles.gradientCard,
          gradientColors && { backgroundColor: gradientColors[0] },
        ];
      default:
        return styles.defaultCard;
    }
  };

  return (
    <View
      style={[
        styles.card,
        getCardStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    overflow: "hidden",
  },
  defaultCard: {
    backgroundColor: colors.gray[800],
  },
  glassCard: {
    backgroundColor: colors.gray[800],
    borderWidth: 1,
    borderColor: colors.gray[700],
    // Effet glassmorphism
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientCard: {
    backgroundColor: colors.primary,
  },
});

