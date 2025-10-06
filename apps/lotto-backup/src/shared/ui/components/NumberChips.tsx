import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/src/shared/ui/theme/tokens';

type Props = {
  numbers: number[];
  bonus?: number;
};

function getNumberColor(n: number): string {
  if (n >= 1 && n <= 9) return colors.lotto.yellow;
  if (n >= 10 && n <= 19) return colors.lotto.blue;
  if (n >= 20 && n <= 29) return colors.lotto.red;
  if (n >= 30 && n <= 39) return colors.lotto.gray;
  if (n >= 40 && n <= 45) return colors.lotto.green;
  return colors.lotto.yellow; // fallback
}

function getBonusColor(): string {
  return colors.lotto.bonus;
}

export default function NumberChips({ numbers, bonus }: Props) {
  return (
    <View style={styles.row}>
      {numbers.map(n => (
        <View
          key={n}
          style={[styles.chip, { backgroundColor: getNumberColor(n) }]}
        >
          <Text style={styles.text}>{n}</Text>
        </View>
      ))}
      {typeof bonus === 'number' && (
        <View style={[styles.chip, { backgroundColor: getBonusColor() }]}>
          <Text style={[styles.text, styles.bonusText]}>{bonus}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bonusText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
