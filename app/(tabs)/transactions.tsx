import { useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useVaultStore } from "@/store/vault";
import { useTransactionStore } from "@/store/transactions";
import { TxListItem, EmptyState } from "@/components";
import { colors, spacing, typography } from "@/theme";

export default function TransactionsScreen() {
  const router = useRouter();
  const { currentVault } = useVaultStore();
  const { transactions, loadTransactions } = useTransactionStore();

  useEffect(() => {
    if (currentVault) {
      loadTransactions(currentVault.id);
    }
  }, [currentVault, loadTransactions]);

  if (!currentVault) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Aucun portefeuille"
          message="Créez votre premier portefeuille pour commencer"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      {transactions.length === 0 ? (
        <EmptyState
          title="Aucune transaction"
          message="Ajoutez votre première transaction pour commencer"
          ctaLabel="Ajouter une transaction"
          onCtaPress={() => router.push("/transaction/add")}
        />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TxListItem transaction={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[400],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary.light,
  },
  list: {
    padding: spacing[2],
  },
});

