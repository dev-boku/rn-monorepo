import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View, Pressable, Dimensions, Alert } from 'react-native';
import { useReviewStore } from '@/src/store/review-store';
import { useDeckStore } from '@/src/store/deck-store';
import type { ReviewRating } from '@/src/types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function StudyScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { getDeckById } = useDeckStore();
  const {
    currentSession,
    reviewQueue,
    currentCardIndex,
    startReviewSession,
    submitReview,
    completeSession,
    getCurrentCard,
    hasMoreCards,
  } = useReviewStore();

  const [showAnswer, setShowAnswer] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const deck = getDeckById(deckId);
  const currentCard = getCurrentCard();

  React.useEffect(() => {
    if (deckId) {
      startReviewSession(deckId);
    }
  }, [deckId]);

  React.useEffect(() => {
    // Reset answer visibility when card changes
    setShowAnswer(false);
    translateX.value = 0;
    opacity.value = 1;
  }, [currentCardIndex]);

  const handleSubmitReview = async (rating: ReviewRating) => {
    if (!currentCard || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await submitReview(currentCard.id, rating);

      // Animate card exit
      translateX.value = withTiming(
        rating === 'hard' ? -SCREEN_WIDTH : SCREEN_WIDTH,
        { duration: 300 },
        () => {
          runOnJS(setIsSubmitting)(false);
        }
      );
      opacity.value = withTiming(0, { duration: 300 });

      // Check if session is complete
      if (!hasMoreCards()) {
        setTimeout(() => {
          handleCompleteSession();
        }, 400);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      Alert.alert('오류', '복습 저장에 실패했습니다');
      setIsSubmitting(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      await completeSession();

      Alert.alert(
        '복습 완료!',
        `${currentSession?.reviewedCards}개의 카드를 복습했습니다.\n\nHard: ${currentSession?.hardCount}\nGood: ${currentSession?.goodCount}\nEasy: ${currentSession?.easyCount}`,
        [
          {
            text: '확인',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to complete session:', error);
      Alert.alert('오류', '세션 종료에 실패했습니다');
    }
  };

  // Gesture handler for swipe
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!showAnswer) return;
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (!showAnswer) {
        translateX.value = withSpring(0);
        return;
      }

      const shouldDismiss = Math.abs(event.translationX) > SWIPE_THRESHOLD;

      if (shouldDismiss) {
        const rating: ReviewRating = event.translationX > 0 ? 'easy' : 'hard';
        runOnJS(handleSubmitReview)(rating);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  if (!deck || !currentCard) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">카드를 불러오는 중...</Text>
      </View>
    );
  }

  const remainingCards = reviewQueue.length - currentCardIndex;

  return (
    <>
      <Stack.Screen
        options={{
          title: deck.name,
          headerRight: () => (
            <Text className="text-muted-foreground mr-4">
              남은 카드: {remainingCards}
            </Text>
          ),
        }}
      />
      <View className="flex-1 bg-background p-4 justify-center">
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle} className="flex-1 justify-center">
            {/* Card Container */}
            <View className="bg-card rounded-2xl p-6 border-2 border-border min-h-[300px] justify-center shadow-lg">
              {/* Front (Question) */}
              <View className="mb-4">
                <Text className="text-sm text-muted-foreground mb-2">질문</Text>
                <Text className="text-2xl font-medium text-card-foreground">
                  {currentCard.front}
                </Text>
              </View>

              {/* Back (Answer) - Show after reveal */}
              {showAnswer && (
                <View className="border-t border-border pt-4 mt-4">
                  <Text className="text-sm text-muted-foreground mb-2">답변</Text>
                  <Text className="text-xl text-card-foreground">{currentCard.back}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View className="mt-6">
              {!showAnswer ? (
                <Button onPress={() => setShowAnswer(true)} className="w-full">
                  <Text>답변 확인</Text>
                </Button>
              ) : (
                <View className="gap-3">
                  <View className="flex-row gap-2">
                    <Button
                      variant="destructive"
                      onPress={() => handleSubmitReview('hard')}
                      disabled={isSubmitting}
                      className="flex-1">
                      <Text>어려움</Text>
                      <Text className="text-xs opacity-70"> +1일</Text>
                    </Button>
                    <Button
                      variant="outline"
                      onPress={() => handleSubmitReview('good')}
                      disabled={isSubmitting}
                      className="flex-1">
                      <Text>보통</Text>
                      <Text className="text-xs opacity-70"> 다음단계</Text>
                    </Button>
                    <Button
                      variant="default"
                      onPress={() => handleSubmitReview('easy')}
                      disabled={isSubmitting}
                      className="flex-1">
                      <Text>쉬움</Text>
                      <Text className="text-xs opacity-70"> 점프</Text>
                    </Button>
                  </View>
                  <Text className="text-xs text-muted-foreground text-center">
                    💡 좌우로 스와이프해도 됩니다 (왼쪽: 어려움, 오른쪽: 쉬움)
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </>
  );
}
