import type { FrequencyData } from '@/src/entities/analysis/lib/useAnalysis';
import { ThemedText } from '@/src/shared/ui/components/ThemedText';
import { ThemedView } from '@/src/shared/ui/components/ThemedView';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  data?: FrequencyData;
};

function getNumberColor(n: number): string {
  if (n >= 1 && n <= 9) return '#FAC400';
  if (n >= 10 && n <= 19) return '#69C8F2';
  if (n >= 20 && n <= 29) return '#FF7171';
  if (n >= 30 && n <= 39) return '#AAAAAA';
  if (n >= 40 && n <= 45) return '#B0D840';
  return '#E9F2FF';
}

export default function FrequencyChart({ data }: Props) {
  if (!data) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>데이터가 없습니다</ThemedText>
      </ThemedView>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>번호별 출현 빈도</ThemedText>
        <ThemedText style={styles.subtitle}>최근 50회차 기준</ThemedText>
      </ThemedView>

      <ThemedView style={styles.chartContainer}>
        {data.slice(0, 10).map(item => (
          <View key={item.number} style={styles.barRow}>
            <View
              style={[
                styles.numberBadge,
                { backgroundColor: getNumberColor(item.number) },
              ]}
            >
              <ThemedText style={styles.numberText}>{item.number}</ThemedText>
            </View>

            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: getNumberColor(item.number),
                  },
                ]}
              />
              <ThemedText style={styles.countText}>{item.count}회</ThemedText>
            </View>

            <ThemedText style={styles.percentText}>
              {item.percentage.toFixed(1)}%
            </ThemedText>
          </View>
        ))}
      </ThemedView>

      <ThemedView style={styles.topNumbers}>
        <ThemedText style={styles.sectionTitle}>
          🔥 HOT 번호 (자주 나온 번호)
        </ThemedText>
        <View style={styles.numberGrid}>
          {data.slice(0, 6).map(item => (
            <View
              key={item.number}
              style={[
                styles.hotNumber,
                { backgroundColor: getNumberColor(item.number) },
              ]}
            >
              <ThemedText style={styles.hotNumberText}>
                {item.number}
              </ThemedText>
              <ThemedText style={styles.hotCountText}>{item.count}</ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.bottomNumbers}>
        <ThemedText style={styles.sectionTitle}>
          ❄️ COLD 번호 (적게 나온 번호)
        </ThemedText>
        <View style={styles.numberGrid}>
          {data
            .slice(-6)
            .reverse()
            .map(item => (
              <View
                key={item.number}
                style={[
                  styles.coldNumber,
                  { backgroundColor: getNumberColor(item.number) },
                ]}
              >
                <ThemedText style={styles.coldNumberText}>
                  {item.number}
                </ThemedText>
                <ThemedText style={styles.coldCountText}>
                  {item.count}
                </ThemedText>
              </View>
            ))}
        </View>
      </ThemedView>
    </ScrollView>
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
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginRight: 12,
    position: 'relative',
  },
  bar: {
    height: '100%',
    borderRadius: 12,
    opacity: 0.3,
  },
  countText: {
    position: 'absolute',
    left: 8,
    top: 3,
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
  percentText: {
    fontSize: 12,
    color: '#64748B',
    width: 40,
    textAlign: 'right',
  },
  topNumbers: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bottomNumbers: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 12,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hotNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coldNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  hotNumberText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
  },
  coldNumberText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
  },
  hotCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Pretendard-Regular',
  },
  coldCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Pretendard-Regular',
  },
});
