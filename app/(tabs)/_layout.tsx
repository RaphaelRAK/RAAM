<<<<<<< HEAD
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { colors } from "@/theme";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

=======
/**
 * Layout des onglets (tabs)
 */

import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { colors } from '@/theme';

export default function TabsLayout() {
>>>>>>> e78d8fa (init projetc)
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
<<<<<<< HEAD
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? colors.background.dark : colors.background.light,
=======
        tabBarInactiveTintColor: colors.gray[600],
        tabBarStyle: {
          backgroundColor: colors.background.light,
>>>>>>> e78d8fa (init projetc)
          borderTopColor: colors.gray[400],
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
<<<<<<< HEAD
          title: "Accueil",
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
=======
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
>>>>>>> e78d8fa (init projetc)
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
<<<<<<< HEAD
          title: "Transactions",
          tabBarIcon: ({ color }) => <TabIcon name="list" color={color} />,
=======
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📊</Text>,
>>>>>>> e78d8fa (init projetc)
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
<<<<<<< HEAD
          title: "Budgets",
          tabBarIcon: ({ color }) => <TabIcon name="pie-chart" color={color} />,
=======
          title: 'Budgets',
          tabBarIcon: ({ color }) => <Text style={{ color }}>💰</Text>,
>>>>>>> e78d8fa (init projetc)
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
<<<<<<< HEAD
          title: "Paramètres",
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
=======
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
>>>>>>> e78d8fa (init projetc)
        }}
      />
    </Tabs>
  );
}

<<<<<<< HEAD
// Composant d'icône simplifié (à remplacer par @expo/vector-icons)
function TabIcon({ name, color }: { name: string; color: string }) {
  // Placeholder - à implémenter avec @expo/vector-icons
  // Exemple: import { Ionicons } from '@expo/vector-icons';
  // return <Ionicons name={name} size={24} color={color} />;
  return null;
}

=======
>>>>>>> e78d8fa (init projetc)
