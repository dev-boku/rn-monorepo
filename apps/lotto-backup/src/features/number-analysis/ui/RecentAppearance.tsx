import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/shared/ui/components/ThemedText';
import { ThemedView } from '@/src/shared/ui/components/ThemedView';
import type { RecentData } from '@/src/entities/analysis/lib/useAnalysis';

type Props = {
  data?: RecentData;
};

function getNumberColor(n: number): string {
  if (n >= 1 && n <= 9) return '#FAC400';
  if (n >= 10 && n <= 19) return '#69C8F2';
  if (n >= 20 && n <= 29) return '#FF7171';
  if (n >= 30 && n <= 39) return '#AAAAAA';
  if (n >= 40 && n <= 45) return '#B0D840';
  return '#E9F2FF';
}

export default function RecentAppearance({ data }: Props) {
  if (!data) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>데이터가 없습니다</ThemedText>
      </ThemedView>
    );
  }

  const longTimeNoSee = data.filter(d => d.gap >= 10);
  const recentlySeen = data.filter(d => d.gap <= 3);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>최근 출현 분석</ThemedText>
        <ThemedText style={styles.subtitle}>
          번호가 마지막으로 나온 시점
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.recentCard}>
        <ThemedText style={styles.sectionTitle}>🔥 최근에 나온 번호</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>3회차 이내 출현</ThemedText>
        <View style={styles.numberGrid}>
          {recentlySeen.map(item => (
            <View key={item.number} style={styles.numberItem}>
              <View
                style={[
                  styles.numberBadge,
                  { backgroundColor: getNumberColor(item.number) },
                ]}
              >
                <ThemedText style={styles.numberText}>{item.number}</ThemedText>
              </View>
              <ThemedText style={styles.gapText}>
                {item.gap === 0 ? '최신' : `${item.gap}회 전`}
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.coldCard}>
        <ThemedText style={styles.sectionTitle}>❄️ 장기 미출현 번호</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          10회차 이상 미출현
        </ThemedText>
        <View style={styles.numberGrid}>
          {longTimeNoSee.slice(0, 12).map(item => (
            <View key={item.number} style={styles.numberItem}>
              <View
                style={[
                  styles.numberBadge,
                  styles.coldBadge,
                  { backgroundColor: getNumberColor(item.number) },
                ]}
              >
                <ThemedText style={styles.numberText}>{item.number}</ThemedText>
              </View>
              <ThemedText style={styles.gapText}>
                {item.gap >= 999 ? '없음' : `${item.gap}회 전`}
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.listCard}>
        <ThemedText style={styles.sectionTitle}>📋 전체 번호 현황</ThemedText>
        <View style={styles.listHeader}>
          <ThemedText style={styles.listHeaderText}>번호</ThemedText>
          <ThemedText style={styles.listHeaderText}>마지막 출현</ThemedText>
          <ThemedText style={styles.listHeaderText}>간격</ThemedText>
        </View>
        {data.slice(0, 15).map(item => (
          <View key={item.number} style={styles.listRow}>
            <View
              style={[
                styles.listNumberBadge,
                { backgroundColor: getNumberColor(item.number) },
              ]}
            >
              <ThemedText style={styles.listNumberText}>
                {item.number}
              </ThemedText>
            </View>
            <ThemedText style={styles.listDrawText}>
              {item.lastDrawNo > 0 ? `${item.lastDrawNo}회` : '-'}
            </ThemedText>
            <ThemedText
              style={[
                styles.listGapText,
                item.gap >= 10 && styles.longGap,
                item.gap <= 3 && styles.shortGap,
              ]}
            >
              {item.gap >= 999 ? '없음' : `${item.gap}회`}
            </ThemedText>
          </View>
        ))}
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
  recentCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  coldCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  numberItem: {
    alignItems: 'center',
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  coldBadge: {
    opacity: 0.7,
  },
  numberText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
  },
  gapText: {
    fontSize: 10,
    color: '#64748B',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  listHeaderText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Pretendard-Medium',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  listNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listNumberText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
  },
  listDrawText: {
    flex: 1,
    fontSize: 12,
  },
  listGapText: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Pretendard-Medium',
  },
  longGap: {
    color: '#3B82F6',
  },
  shortGap: {
    color: '#EF4444',
  },
});
