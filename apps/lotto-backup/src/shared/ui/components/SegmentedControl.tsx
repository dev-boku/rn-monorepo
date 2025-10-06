import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  segments: string[];
  activeIndex?: number;
  onPress?: (index: number) => void;
};

export default function SegmentedControl({
  segments,
  activeIndex = 0,
  onPress,
}: Props) {
  return (
    <View style={styles.container}>
      {segments.map((s, idx) => (
        <Pressable
          key={s}
          style={[styles.segment, idx === activeIndex && styles.active]}
          onPress={() => onPress?.(idx)}
        >
          <Text style={[styles.text, idx === activeIndex && styles.textActive]}>
            {s}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2F7',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  active: {
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 13,
    color: '#334155',
  },
  textActive: {
    color: '#0F172A',
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
  },
});
