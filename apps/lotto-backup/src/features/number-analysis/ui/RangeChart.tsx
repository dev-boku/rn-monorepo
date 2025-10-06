import type { RangeData } from '@/src/entities/analysis/lib/useAnalysis';
import { ThemedText } from '@/src/shared/ui/components/ThemedText';
import { ThemedView } from '@/src/shared/ui/components/ThemedView';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  data?: RangeData;
};

const RANGE_COLORS = {
  '1-10': '#FAC400',
  '11-20': '#69C8F2',
  '21-30': '#FF7171',
  '31-40': '#AAAAAA',
  '41-45': '#B0D840',
};

export default function RangeChart({ data }: Props) {
  if (!data) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>데이터가 없습니다</ThemedText>
      </ThemedView>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>구간별 분포</ThemedText>
        <ThemedText style={styles.subtitle}>번호 구간별 출현 통계</ThemedText>
      </ThemedView>

      <ThemedView style={styles.chartCard}>
        {data.map(item => (
          <View key={item.range} style={styles.rangeRow}>
            <View
              style={[
                styles.rangeLabel,
                {
                  backgroundColor:
                    RANGE_COLORS[item.range as keyof typeof RANGE_COLORS],
                },
              ]}
            >
              <ThemedText style={styles.rangeLabelText}>
                {item.range}
              </ThemedText>
            </View>

            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor:
                      RANGE_COLORS[item.range as keyof typeof RANGE_COLORS],
                  },
                ]}
              />
              <View style={styles.barTextContainer}>
                <ThemedText style={styles.countText}>{item.count}개</ThemedText>
                <ThemedText style={styles.percentText}>
                  {item.percentage.toFixed(1)}%
                </ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ThemedView>

      <ThemedView style={styles.insightCard}>
        <ThemedText style={styles.insightTitle}>📊 구간 분석</ThemedText>
        <View style={styles.insightGrid}>
          {data.map(item => {
            const isHigh = item.percentage > 22;
            const isLow = item.percentage < 18;

            return (
              <View key={item.range} style={styles.insightItem}>
                <View
                  style={[
                    styles.insightBadge,
                    {
                      backgroundColor:
                        RANGE_COLORS[item.range as keyof typeof RANGE_COLORS],
                    },
                  ]}
                >
                  <ThemedText style={styles.insightBadgeText}>
                    {item.range}
                  </ThemedText>
                </View>
                <ThemedText style={styles.insightValue}>
                  {item.percentage.toFixed(1)}%
                </ThemedText>
                {isHigh && (
                  <ThemedText style={styles.insightHigh}>↑ 높음</ThemedText>
                )}
                {isLow && (
                  <ThemedText style={styles.insightLow}>↓ 낮음</ThemedText>
                )}
              </View>
            );
          })}
        </View>
      </ThemedView>

      <ThemedView style={styles.tipCard}>
        <ThemedText style={styles.tipTitle}>💡 균형잡힌 선택</ThemedText>
        <ThemedText style={styles.tipText}>
          통계적으로 각 구간에서 1-2개씩 고르게 선택하는 것이 일반적입니다. 특정
          구간에 편중된 조합은 당첨 확률이 낮을 수 있습니다.
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
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rangeLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  rangeLabelText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
  },
  barContainer: {
    flex: 1,
    height: 36,
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    position: 'relative',
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 18,
    opacity: 0.3,
  },
  barTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  countText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Medium',
  },
  percentText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Bold',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 12,
  },
  insightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightItem: {
    alignItems: 'center',
    width: '18%',
  },
  insightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  insightBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Pretendard-Bold',
  },
  insightValue: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    marginBottom: 2,
  },
  insightHigh: {
    fontSize: 10,
    color: '#10B981',
    fontFamily: 'Pretendard-Bold',
  },
  insightLow: {
    fontSize: 10,
    color: '#EF4444',
    fontFamily: 'Pretendard-Bold',
  },
  tipCard: {
    backgroundColor: '#F0FDF4',
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
