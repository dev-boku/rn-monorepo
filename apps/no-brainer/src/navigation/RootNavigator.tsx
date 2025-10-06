import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { TabNavigator } from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        {/* 추가 화면들은 나중에 구현 */}
        {/* <Stack.Screen name="DeckDetail" component={DeckDetailScreen} /> */}
        {/* <Stack.Screen name="CreateDeck" component={CreateDeckScreen} /> */}
        {/* <Stack.Screen name="EditDeck" component={EditDeckScreen} /> */}
        {/* <Stack.Screen name="CreateCard" component={CreateCardScreen} /> */}
        {/* <Stack.Screen name="EditCard" component={EditCardScreen} /> */}
        {/* <Stack.Screen name="StudySession" component={StudySessionScreen} /> */}
        {/* <Stack.Screen name="CardReview" component={CardReviewScreen} /> */}
        {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}