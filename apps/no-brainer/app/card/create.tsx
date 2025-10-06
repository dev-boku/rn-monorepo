import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View, Alert, TextInput, ScrollView } from 'react-native';
import { useCardStore } from '@/src/store/card-store';
import type { CardTemplate } from '@/src/types';

export default function CreateCardScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { createCard } = useCardStore();

  const [template, setTemplate] = React.useState<CardTemplate>('basic');
  const [front, setFront] = React.useState('');
  const [back, setBack] = React.useState('');
  const [tags, setTags] = React.useState('');

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('오류', '앞면과 뒷면을 모두 입력하세요');
      return;
    }

    if (!deckId) {
      Alert.alert('오류', '덱 ID가 없습니다');
      return;
    }

    try {
      await createCard({
        deckId,
        front: front.trim(),
        back: back.trim(),
        tags: tags.trim() || undefined,
        template,
      });

      Alert.alert('완료', '카드가 생성되었습니다', [
        {
          text: '확인',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Failed to create card:', error);
      Alert.alert('오류', '카드 생성에 실패했습니다');
    }
  };

  const handleSaveAndContinue = async () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('오류', '앞면과 뒷면을 모두 입력하세요');
      return;
    }

    if (!deckId) {
      Alert.alert('오류', '덱 ID가 없습니다');
      return;
    }

    try {
      await createCard({
        deckId,
        front: front.trim(),
        back: back.trim(),
        tags: tags.trim() || undefined,
        template,
      });

      // Reset form
      setFront('');
      setBack('');
      setTags('');

      Alert.alert('완료', '카드가 생성되었습니다. 계속 추가하세요.');
    } catch (error) {
      console.error('Failed to create card:', error);
      Alert.alert('오류', '카드 생성에 실패했습니다');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: '카드 생성' }} />
      <ScrollView className="flex-1 bg-background">
        <View className="p-4 gap-4">
          {/* Template Selection */}
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">템플릿</Text>
            <View className="flex-row gap-2">
              <Button
                variant={template === 'basic' ? 'default' : 'outline'}
                onPress={() => setTemplate('basic')}
                className="flex-1">
                <Text>Basic</Text>
              </Button>
              <Button
                variant={template === 'basic-reversed' ? 'default' : 'outline'}
                onPress={() => setTemplate('basic-reversed')}
                className="flex-1">
                <Text>Basic (Reversed)</Text>
              </Button>
            </View>
            <Text className="text-xs text-muted-foreground mt-1">
              {template === 'basic'
                ? '앞면 → 뒷면 단방향 카드'
                : '앞면 ↔ 뒷면 양방향 카드 (2장 생성)'}
            </Text>
          </View>

          {/* Front Field */}
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">앞면 (Front)</Text>
            <TextInput
              value={front}
              onChangeText={setFront}
              placeholder="질문 또는 용어를 입력하세요"
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground min-h-[100px]"
              placeholderTextColor="#888"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Back Field */}
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">뒷면 (Back)</Text>
            <TextInput
              value={back}
              onChangeText={setBack}
              placeholder="답변 또는 설명을 입력하세요"
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground min-h-[100px]"
              placeholderTextColor="#888"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Tags Field */}
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">태그 (선택)</Text>
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="태그를 쉼표로 구분하여 입력 (예: 영어, 단어)"
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#888"
            />
          </View>

          {/* Action Buttons */}
          <View className="gap-2 mt-4">
            <Button onPress={handleSave}>
              <Text>저장</Text>
            </Button>
            <Button variant="outline" onPress={handleSaveAndContinue}>
              <Text>저장하고 계속 추가</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
