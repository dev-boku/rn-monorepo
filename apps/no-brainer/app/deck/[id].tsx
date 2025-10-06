import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { PlusIcon, PlayIcon, Trash2Icon } from 'lucide-react-native';
import * as React from 'react';
import { FlatList, Pressable, View, Alert } from 'react-native';
import { useDeckStore } from '@/src/store/deck-store';
import { useCardStore } from '@/src/store/card-store';
import { formatDueDate } from '@/src/lib/srs';

export default function DeckDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDeckById, deleteDeck } = useDeckStore();
  const { cards, loadCardsByDeck, deleteCard } = useCardStore();

  const deck = getDeckById(id);

  React.useEffect(() => {
    if (id) {
      loadCardsByDeck(id);
    }
  }, [id]);

  const handleDeleteDeck = () => {
    Alert.alert('덱 삭제', '정말로 이 덱을 삭제하시겠습니까? 모든 카드가 함께 삭제됩니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDeck(id);
            router.back();
          } catch (error) {
            Alert.alert('오류', '덱 삭제에 실패했습니다');
          }
        },
      },
    ]);
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert('카드 삭제', '이 카드를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCard(cardId);
          } catch (error) {
            Alert.alert('오류', '카드 삭제에 실패했습니다');
          }
        },
      },
    ]);
  };

  const handleStartStudy = () => {
    const dueCards = cards.filter((card) => card.reviewState.dueDate <= Date.now());
    if (dueCards.length === 0) {
      Alert.alert('알림', '복습할 카드가 없습니다');
      return;
    }
    router.push(`/study/${id}`);
  };

  if (!deck) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">덱을 찾을 수 없습니다</Text>
      </View>
    );
  }

  const dueCards = cards.filter((card) => card.reviewState.dueDate <= Date.now());

  return (
    <>
      <Stack.Screen
        options={{
          title: deck.name,
          headerRight: () => (
            <Button variant="ghost" size="icon" onPress={handleDeleteDeck}>
              <Icon as={Trash2Icon} className="text-destructive" />
            </Button>
          ),
        }}
      />
      <View className="flex-1 bg-background">
        {/* Deck Stats */}
        <View className="bg-card border-b border-border p-4">
          <View className="flex-row items-center justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-card-foreground">{deck.totalCards}</Text>
              <Text className="text-sm text-muted-foreground">전체 카드</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-destructive">{dueCards.length}</Text>
              <Text className="text-sm text-muted-foreground">복습 대기</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">{deck.newCards}</Text>
              <Text className="text-sm text-muted-foreground">새 카드</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 p-4">
          <Button
            onPress={handleStartStudy}
            disabled={dueCards.length === 0}
            className="flex-1">
            <Icon as={PlayIcon} className="mr-2" />
            <Text>학습 시작</Text>
          </Button>
          <Button variant="outline" onPress={() => router.push(`/card/create?deckId=${id}`)}>
            <Icon as={PlusIcon} className="mr-2" />
            <Text>카드 추가</Text>
          </Button>
        </View>

        {/* Card List */}
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4 gap-3"
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-muted-foreground text-center">
                아직 카드가 없습니다{'\n'}카드 추가 버튼을 눌러 카드를 만들어보세요
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onLongPress={() => handleDeleteCard(item.id)}
              className="bg-card rounded-lg p-4 border border-border active:opacity-80">
              <View className="mb-2">
                <Text className="text-sm text-muted-foreground mb-1">앞면</Text>
                <Text className="text-foreground" numberOfLines={2}>
                  {item.front}
                </Text>
              </View>
              <View className="mb-2">
                <Text className="text-sm text-muted-foreground mb-1">뒷면</Text>
                <Text className="text-foreground" numberOfLines={2}>
                  {item.back}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted-foreground">
                  {item.reviewState.reviewCount}회 복습
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {formatDueDate(item.reviewState.dueDate)}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </>
  );
}
