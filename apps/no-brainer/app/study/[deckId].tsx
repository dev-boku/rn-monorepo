import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useReviewStore } from '@/store/review-store';
import { Button } from '@/components/Button';
import { Card } from '@/types';

export default function StudyScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const router = useRouter();
  const {
    currentSession,
    currentCard,
    startSession,
    submitReview,
    endSession
  } = useReviewStore();

  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (deckId) {
      startSession(deckId);
    }
  }, [deckId]);

  const handleReview = (rating: 'hard' | 'good' | 'easy') => {
    submitReview(currentCard?.id!, rating);
    setShowAnswer(false);
  };

  const handleFinish = () => {
    endSession();
    router.back();
  };

  if (!currentSession) {
    return (
      <View style={styles.container}>
        <Text>Loading session...</Text>
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>Session Complete! 🎉</Text>
          <Text style={styles.statsText}>
            Reviewed {currentSession.reviewedCount} cards
          </Text>
          <Button title="Finish" onPress={handleFinish} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {currentSession.reviewedCount + 1} / {currentSession.totalCards}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Question</Text>
          <Text style={styles.cardContent}>{currentCard.front}</Text>
        </View>

        {showAnswer && (
          <View style={[styles.card, styles.answerCard]}>
            <Text style={styles.cardLabel}>Answer</Text>
            <Text style={styles.cardContent}>{currentCard.back}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {!showAnswer ? (
          <Button
            title="Show Answer"
            onPress={() => setShowAnswer(true)}
            variant="primary"
            style={styles.showAnswerButton}
          />
        ) : (
          <View style={styles.ratingButtons}>
            <TouchableOpacity
              style={[styles.ratingButton, styles.hardButton]}
              onPress={() => handleReview('hard')}
            >
              <Text style={styles.ratingButtonText}>Hard</Text>
              <Text style={styles.ratingButtonSubtext}>Try again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingButton, styles.goodButton]}
              onPress={() => handleReview('good')}
            >
              <Text style={styles.ratingButtonText}>Good</Text>
              <Text style={styles.ratingButtonSubtext}>Got it</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingButton, styles.easyButton]}
              onPress={() => handleReview('easy')}
            >
              <Text style={styles.ratingButtonText}>Easy</Text>
              <Text style={styles.ratingButtonSubtext}>Too easy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progress: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  answerCard: {
    backgroundColor: '#f0f9ff',
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 18,
    lineHeight: 26,
  },
  actions: {
    padding: 16,
  },
  showAnswerButton: {
    width: '100%',
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hardButton: {
    backgroundColor: '#fee2e2',
  },
  goodButton: {
    backgroundColor: '#dbeafe',
  },
  easyButton: {
    backgroundColor: '#dcfce7',
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ratingButtonSubtext: {
    fontSize: 12,
    color: '#666',
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  completedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
});