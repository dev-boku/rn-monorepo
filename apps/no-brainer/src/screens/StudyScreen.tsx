import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export function StudyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Swipe right - find misery and{'\n'}heartbreak. Here's why{'\n'}catheining should be a crime</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={[styles.button, styles.hardButton]}>
            <Text style={styles.buttonText}>Hard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.goodButton]}>
            <Text style={styles.buttonText}>Good</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.easyButton]}>
            <Text style={styles.buttonText}>Easy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    minHeight: 200,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.lg,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.lg,
  },
  button: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  hardButton: {
    backgroundColor: theme.colors.difficulty.hard,
  },
  goodButton: {
    backgroundColor: theme.colors.difficulty.good,
  },
  easyButton: {
    backgroundColor: theme.colors.difficulty.easy,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.md,
  },
});