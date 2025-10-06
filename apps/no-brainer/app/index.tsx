import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Stack, useRouter } from 'expo-router';
import { MoonStarIcon, PlusIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { FlatList, Pressable, View, Alert, TextInput } from 'react-native';
import { useDeckStore } from '@/src/store/deck-store';

const SCREEN_OPTIONS = {
  light: {
    title: 'NoBrainer',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerRight: () => <ThemeToggle />,
  },
  dark: {
    title: 'NoBrainer',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerRight: () => <ThemeToggle />,
  },
};

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { decks, loadDecks, createDeck } = useDeckStore();
  const [showCreateDeck, setShowCreateDeck] = React.useState(false);
  const [deckName, setDeckName] = React.useState('');

  React.useEffect(() => {
    loadDecks();
  }, []);

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      Alert.alert('오류', '덱 이름을 입력하세요');
      return;
    }

    try {
      await createDeck({
        name: deckName.trim(),
        notificationEnabled: false,
      });
      setDeckName('');
      setShowCreateDeck(false);
    } catch (error) {
      Alert.alert('오류', '덱 생성에 실패했습니다');
    }
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <View className="flex-1 bg-background">
        {/* Deck List */}
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4 gap-4"
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-muted-foreground text-center">
                아직 덱이 없습니다{'\n'}하단의 + 버튼을 눌러 덱을 만들어보세요
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/deck/${item.id}`)}
              className="bg-card rounded-lg p-4 border border-border active:opacity-80">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xl font-bold text-card-foreground">{item.name}</Text>
                {item.dueToday > 0 && (
                  <View className="bg-destructive rounded-full px-3 py-1">
                    <Text className="text-destructive-foreground text-sm font-medium">
                      {item.dueToday}
                    </Text>
                  </View>
                )}
              </View>
              <View className="flex-row items-center gap-4">
                <Text className="text-muted-foreground text-sm">
                  전체 {item.totalCards}장
                </Text>
                <Text className="text-muted-foreground text-sm">
                  새 카드 {item.newCards}장
                </Text>
              </View>
            </Pressable>
          )}
        />

        {/* Create Deck Input */}
        {showCreateDeck && (
          <View className="bg-card border-t border-border p-4 gap-2">
            <TextInput
              value={deckName}
              onChangeText={setDeckName}
              placeholder="덱 이름 입력"
              className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#888"
              autoFocus
            />
            <View className="flex-row gap-2">
              <Button variant="outline" onPress={() => setShowCreateDeck(false)} className="flex-1">
                <Text>취소</Text>
              </Button>
              <Button onPress={handleCreateDeck} className="flex-1">
                <Text>생성</Text>
              </Button>
            </View>
          </View>
        )}

        {/* FAB: Add Deck */}
        {!showCreateDeck && (
          <Pressable
            onPress={() => setShowCreateDeck(true)}
            className="absolute bottom-6 right-6 bg-primary rounded-full w-14 h-14 items-center justify-center shadow-lg active:opacity-80">
            <Icon as={PlusIcon} className="text-primary-foreground" />
          </Pressable>
        )}
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
