import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="scan" options={{ headerShown: false }} />
      <Stack.Screen name="analysis" options={{ headerShown: false }} />
    </Stack>
  );
}
