import type { OddEvenData } from '@/src/entities/analysis/lib/useAnalysis';
import { ThemedText } from '@/src/shared/ui/components/ThemedText';
import { ThemedView } from '@/src/shared/ui/components/ThemedView';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  data?: OddEvenData;
};

export default function OddEvenChart({ data }: Props) {
  if (!data) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>데이터가 없습니다</ThemedText>
      </ThemedView>
    );
  }

  const totalCount = data.oddCount + data.evenCount;
  const oddPercentage = (data.oddCount / totalCount) * 100;
  const evenPercentage = (data.evenCount / totalCount) * 100;

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>홀짝 비율 분석</ThemedText>
        <ThemedText style={styles.subtitle}>최근 20회차 기준</ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.label}>홀수</ThemedText>
            <ThemedText style={styles.bigNumber}>{data.oddCount}</ThemedText>
            <ThemedText style={styles.percentage}>
              {oddPercentage.toFixed(1)}%
            </ThemedText>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <ThemedText style={styles.label}>짝수</ThemedText>
            <ThemedText style={styles.bigNumber}>{data.evenCount}</ThemedText>
            <ThemedText style={styles.percentage}>
              {evenPercentage.toFixed(1)}%
            </ThemedText>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.oddBar, { width: `${oddPercentage}%` }]} />
        </View>
      </ThemedView>

      <ThemedView style={styles.patternCard}>
        <ThemedText style={styles.sectionTitle}>최근 패턴</ThemedText>
        <View style={styles.patternList}>
          {data.patterns
            .slice(-10)
            .reverse()
            .map(pattern => (
              <View key={pattern.drawNo} style={styles.patternRow}>
                <ThemedText style={styles.drawNoText}>
                  {pattern.drawNo}회
                </ThemedText>
                <View style={styles.patternBars}>
                  {[...Array(6)].map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.patternDot,
                        index < pattern.odd ? styles.oddDot : styles.evenDot,
                      ]}
                    />
                  ))}
                </View>
                <ThemedText style={styles.patternText}>
                  홀{pattern.odd} : 짝{pattern.even}
                </ThemedText>
              </View>
            ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.tipCard}>
        <ThemedText style={styles.tipTitle}>💡 통계적 경향</ThemedText>
        <ThemedText style={styles.tipText}>
          일반적으로 홀수 3개, 짝수 3개의 균형잡힌 조합이 가장 많이 나타납니다.
          극단적인 조합(홀수 6개 또는 짝수 6개)은 매우 드물게 나타납니다.
        </ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  bigNumber: {
    fontSize: 32,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 4,
  },
  percentage: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#3B82F6',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#FCA5A5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  oddBar: {
    height: '100%',
    backgroundColor: '#60A5FA',
  },
  patternCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 12,
  },
  patternList: {
    gap: 8,
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  drawNoText: {
    fontSize: 12,
    color: '#64748B',
    width: 50,
  },
  patternBars: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
    marginHorizontal: 12,
  },
  patternDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  oddDot: {
    backgroundColor: '#60A5FA',
  },
  evenDot: {
    backgroundColor: '#FCA5A5',
  },
  patternText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    width: 60,
    textAlign: 'right',
  },
  tipCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
});
