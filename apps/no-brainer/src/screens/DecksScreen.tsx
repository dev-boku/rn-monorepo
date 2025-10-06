import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { TabNavigationProp } from '../types/navigation';

type Props = {
  navigation: TabNavigationProp<'Decks'>;
};

const DUMMY_DECKS = [
  { id: '1', name: '영어 단어', cardCount: 150, dueCount: 10 },
  { id: '2', name: '일본어 기초', cardCount: 80, dueCount: 5 },
  { id: '3', name: '프로그래밍 용어', cardCount: 200, dueCount: 15 },
];

export function DecksScreen({ navigation }: Props) {
  const renderDeckItem = ({ item }: any) => (
    <TouchableOpacity style={styles.deckCard}>
      <View style={styles.deckHeader}>
        <Text style={styles.deckName}>{item.name}</Text>
        {item.dueCount > 0 && (
          <View style={styles.dueBadge}>
            <Text style={styles.dueText}>{item.dueCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardCount}>{item.cardCount} 카드</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 덱</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 새 덱</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={DUMMY_DECKS}
        renderItem={renderDeckItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  addButtonText: {
    color: theme.colors.primary.contrast,
    fontWeight: theme.typography.weights.medium,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  deckCard: {
    backgroundColor: theme.colors.background.paper,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  deckName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  cardCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  dueBadge: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
  },
  dueText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
});