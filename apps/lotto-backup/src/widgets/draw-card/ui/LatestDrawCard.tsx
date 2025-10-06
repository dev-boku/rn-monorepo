import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { NumberChips, IconSymbol } from '@/src/shared/ui/components';
import { LottoDraw, formatWonShort } from '@/src/shared/api';

type Props = {
  draw?: LottoDraw | null;
  onPrev?: () => void;
  onNext?: () => void;
  onReload?: () => void;
  loading?: boolean;
  canPrev?: boolean;
  canNext?: boolean;
};

export default function LatestDrawCard({
  draw,
  onPrev,
  onNext,
  onReload,
  loading,
  canPrev,
  canNext,
}: Props) {
  const dateLabel = draw?.drawDate ? draw.drawDate.replaceAll('-', '.') : '';
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Pressable
          disabled={loading || !canPrev}
          onPress={onPrev}
          style={[styles.navButton, { opacity: loading || !canPrev ? 0.3 : 1 }]}
        >
          <IconSymbol name="chevron.left" size={24} color="#334155" />
        </Pressable>

        <Pressable
          onPress={onReload}
          style={styles.centerInfo}
          disabled={loading}
        >
          <Text style={styles.meta}>
            {draw ? `제 ${draw.drawNo}회 • ${dateLabel}` : '로또 번호'}
          </Text>
        </Pressable>

        <Pressable
          disabled={loading || !canNext}
          onPress={onNext}
          style={[styles.navButton, { opacity: loading || !canNext ? 0.3 : 1 }]}
        >
          <IconSymbol name="chevron.right" size={24} color="#334155" />
        </Pressable>
      </View>

      <NumberChips numbers={draw?.numbers ?? []} bonus={draw?.bonus} />

      <View style={styles.footerRow}>
        <Text style={styles.kpi}>
          {draw?.firstWinners ? `1등 ${draw.firstWinners}명` : '1등 -명'}
        </Text>
        <Text style={styles.kpi}>
          {`총 당첨금 ${formatWonShort(draw?.firstTotalAmount)}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  centerInfo: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  meta: {
    color: '#334155',
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  kpi: {
    color: '#0F172A',
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
  },
});
