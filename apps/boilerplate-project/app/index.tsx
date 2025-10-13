import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useDeckStore } from '@/store/deck-store';
import { Button } from '@/components/Button';

export default function HomeScreen() {
  const router = useRouter();
  const { decks, loadDecks } = useDeckStore();

  useEffect(() => {
    loadDecks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deckCard}
            onPress={() => router.push(`/deck/${item.id}`)}
          >
            <Text style={styles.deckTitle}>{item.name}</Text>
            <Text style={styles.deckStats}>
              {item.cardCount} cards • {item.dueCount} due today
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No decks yet</Text>
            <Text style={styles.emptySubtext}>Create your first deck to get started</Text>
          </View>
        }
      />
      <Button
        title="Create Deck"
        onPress={() => router.push('/deck/create')}
        style={styles.createButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  deckCard: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  deckStats: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  createButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
  },
});