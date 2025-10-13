import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useCardStore } from '@/store/card-store';
import { useDeckStore } from '@/store/deck-store';
import { Button } from '@/components/Button';

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { cards, loadCards } = useCardStore();
  const { getDeck } = useDeckStore();
  const deck = getDeck(id);

  useEffect(() => {
    if (id) {
      loadCards(id);
    }
  }, [id]);

  const handleStartStudy = () => {
    router.push(`/study/${id}`);
  };

  const handleCreateCard = () => {
    router.push({
      pathname: '/card/create',
      params: { deckId: id },
    });
  };

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text>Deck not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.deckName}>{deck.name}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>{deck.cardCount} total cards</Text>
          <Text style={styles.statText}>{deck.dueCount} due today</Text>
          <Text style={styles.statText}>{deck.newCount} new cards</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Study Now" onPress={handleStartStudy} variant="primary" />
        <Button title="Add Card" onPress={handleCreateCard} variant="secondary" />
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardItem}>
            <Text style={styles.cardFront} numberOfLines={1}>
              {item.front}
            </Text>
            <Text style={styles.cardBack} numberOfLines={1}>
              {item.back}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cards in this deck</Text>
            <Text style={styles.emptySubtext}>Add some cards to start studying</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  deckName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cardItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  cardFront: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardBack: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});