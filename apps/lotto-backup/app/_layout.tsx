import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme, useSplashPreload } from '@/src/shared/lib/hooks';
import { SplashScreen } from '@/src/shared/ui/components';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  const { isReady, status, statusText, progress } = useSplashPreload();

  // Splash 화면 완료 처리
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Splash 화면이 표시되는 동안
  if (showSplash || !isReady) {
    return (
      <>
        <SplashScreen
          status={status}
          statusText={statusText}
          progress={progress}
          onComplete={handleSplashComplete}
        />
        <StatusBar style="light" />
      </>
    );
  }

  // 메인 앱 화면
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
