import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

type Props = {
  items?: string[]; // e.g., ["월", "화", ...] or recent draw labels
  activeIndex?: number;
};

export default function WeeklyStrip({
  items = ['월', '화', '수', '목', '금', '토', '일'],
  activeIndex = 2,
}: Props) {
  return (
    <View style={styles.container}>
      {items.map((label, idx) => (
        <View
          key={idx}
          style={[styles.chip, idx === activeIndex && styles.chipActive]}
        >
          <Text style={[styles.text, idx === activeIndex && styles.textActive]}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  chipActive: {
    backgroundColor: '#1E6BFF',
  },
  text: {
    fontSize: 13,
    color: '#334155',
  },
  textActive: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
  },
});
