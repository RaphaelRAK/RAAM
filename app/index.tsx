import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/theme';

export default function Index() {
  const router = useRouter();
  const { isInitialized } = useAuthStore();

  useEffect(() => {
    console.log('Index: isInitialized =', isInitialized);
    if (isInitialized) {
      // Redirection directe vers le dashboard, même sans onboarding
      console.log('Index: Redirection vers dashboard');
      router.replace('/(tabs)/dashboard');
    }
  }, [isInitialized, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.light,
  },
});