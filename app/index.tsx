import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/theme';

export default function Index() {
  const router = useRouter();
  const { isInitialized, isOnboarded } = useAuthStore();

  useEffect(() => {
    console.log('Index: isInitialized =', isInitialized, 'isOnboarded =', isOnboarded);
    if (isInitialized) {
      if (isOnboarded) {
        console.log('Index: Redirection vers dashboard');
        router.replace('/(tabs)/dashboard');
      } else {
        console.log('Index: Redirection vers onboarding');
        router.replace('/onboarding');
      }
    }
  }, [isInitialized, isOnboarded, router]);

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