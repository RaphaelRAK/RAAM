import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { Card, Button } from "@/components";
import { colors, spacing, typography, borderRadius } from "@/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const { userLocal } = useAuthStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <Text style={styles.sectionText}>
          ID: {userLocal?.id_device || "N/A"}
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sécurité</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Verrouillage par code</Text>
          <Text style={styles.settingValue}>Non configuré</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Mode confidentialité</Text>
          <Text style={styles.settingValue}>Désactivé</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Données</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Exporter en CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>Synchronisation</Text>
          <Text style={styles.settingValue}>Premium requis</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Premium</Text>
        <Button
          title="Passer à Premium"
          onPress={() => router.push("/paywall")}
          variant="primary"
          style={styles.button}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  content: {
    padding: spacing[4],
  },
  header: {
    marginBottom: spacing[6],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
    marginBottom: spacing[3],
  },
  sectionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[400],
  },
  settingLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary.light,
  },
  settingValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary.light,
  },
  button: {
    marginTop: spacing[2],
  },
});

