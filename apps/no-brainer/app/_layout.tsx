import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { initDatabase } from '@/src/lib/database';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    // Initialize database on app start
    initDatabase();
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="deck/[id]" options={{ headerShown: true, title: '덱 상세' }} />
        <Stack.Screen name="card/create" options={{ headerShown: true, title: '카드 생성' }} />
        <Stack.Screen name="study/[deckId]" options={{ headerShown: true, title: '학습' }} />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
