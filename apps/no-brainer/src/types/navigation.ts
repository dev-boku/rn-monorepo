import { NavigatorScreenParams } from '@react-navigation/native';

// Bottom Tab Navigator 파라미터 타입
export type TabParamList = {
  Home: undefined;
  Decks: undefined;
  Study: undefined;
  Stats: undefined;
  Settings: undefined;
};

// Stack Navigator 파라미터 타입
export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  DeckDetail: { deckId: string };
  CreateDeck: undefined;
  EditDeck: { deckId: string };
  CreateCard: { deckId: string };
  EditCard: { cardId: string; deckId: string };
  StudySession: { deckId: string };
  CardReview: { cardId: string };
  Onboarding: undefined;
};

// 네비게이션 prop 타입 헬퍼
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

export type TabNavigationProp<T extends keyof TabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, T>,
  StackNavigationProp<RootStackParamList>
>;

export type RootNavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  T
>;