/**
 * Layout des onglets (tabs)
 */

import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { colors } from '@/theme';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[600],
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.background.dark : colors.background.light,
          borderTopColor: colors.gray[400],
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color }) => <Text style={{ color }}>💰</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}