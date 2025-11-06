import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { colors } from "@/theme";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? colors.background.dark : colors.background.light,
          borderTopColor: colors.gray[400],
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => <TabIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: "Budgets",
          tabBarIcon: ({ color }) => <TabIcon name="pie-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Composant d'icône simplifié (à remplacer par @expo/vector-icons)
function TabIcon({ name, color }: { name: string; color: string }) {
  // Placeholder - à implémenter avec @expo/vector-icons
  // Exemple: import { Ionicons } from '@expo/vector-icons';
  // return <Ionicons name={name} size={24} color={color} />;
  return null;
}

