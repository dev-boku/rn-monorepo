import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useCardStore } from '@/store/card-store';
import { Button } from '@/components/Button';

export default function CreateCardScreen() {
  const { deckId } = useLocalSearchParams<{ deckId?: string }>();
  const router = useRouter();
  const { createCard } = useCardStore();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('Error', 'Please fill in both front and back of the card');
      return;
    }

    if (!deckId) {
      Alert.alert('Error', 'No deck selected');
      return;
    }

    try {
      await createCard({
        deckId,
        front: front.trim(),
        back: back.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      Alert.alert('Success', 'Card created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);

      // Reset form
      setFront('');
      setBack('');
      setTags('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create card');
    }
  };

  const handleSaveAndAddAnother = async () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('Error', 'Please fill in both front and back of the card');
      return;
    }

    if (!deckId) {
      Alert.alert('Error', 'No deck selected');
      return;
    }

    try {
      await createCard({
        deckId,
        front: front.trim(),
        back: back.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      // Reset form but stay on the page
      setFront('');
      setBack('');
      setTags('');

      Alert.alert('Success', 'Card created! Add another one.');
    } catch (error) {
      Alert.alert('Error', 'Failed to create card');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Front (Question)</Text>
          <TextInput
            style={styles.textInput}
            value={front}
            onChangeText={setFront}
            placeholder="Enter the question or prompt"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Back (Answer)</Text>
          <TextInput
            style={styles.textInput}
            value={back}
            onChangeText={setBack}
            placeholder="Enter the answer or explanation"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.tagsInput]}
            value={tags}
            onChangeText={setTags}
            placeholder="Comma separated tags: vocab, chapter1, important"
          />
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Save & Close"
          onPress={handleSave}
          variant="primary"
        />
        <Button
          title="Save & Add Another"
          onPress={handleSaveAndAddAnother}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tagsInput: {
    minHeight: 50,
  },
  actions: {
    padding: 16,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});