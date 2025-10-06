import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function BarPlaceholder() {
  return (
    <View style={styles.card}>
      <View style={styles.legend}>
        <View style={[styles.dot, { backgroundColor: '#7FE3E1' }]} />
        <View style={styles.legendBar} />
        <View style={[styles.dot, { backgroundColor: '#1E6BFF' }]} />
        <View style={[styles.legendBar, { width: 80 }]} />
      </View>
      <View style={styles.bars}>
        {[40, 60, 50, 70, 110].map((h, i) => (
          <View key={i} style={[styles.bar, { height: h }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendBar: {
    height: 8,
    width: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  bars: {
    height: 140,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bar: {
    width: 28,
    borderRadius: 4,
    backgroundColor: '#7FE3E1',
  },
});
