import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {
  ThemedText,
  ThemedView,
  IconSymbol,
  SegmentedControl,
} from '@/src/shared/ui/components';
import { useAnalysis } from '@/src/entities/analysis';
import { useRouter } from 'expo-router';
import {
  FrequencyChart,
  OddEvenChart,
  RangeChart,
  RecentAppearance,
} from '@/src/features/number-analysis';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/shared/ui/theme';

const ANALYSIS_TABS = ['출현 빈도', '최근 출현', '홀짝 분석', '구간별'];

export default function AnalysisScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const { data, loading, error, isFromCache, refresh } = useAnalysis();
  const router = useRouter();

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ThemedText style={styles.loadingText}>
            분석 데이터 로딩 중...
          </ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            데이터를 불러올 수 없습니다
          </ThemedText>
          <ThemedText style={styles.errorDetail}>{error}</ThemedText>
        </View>
      );
    }

    switch (activeTab) {
      case 0: // 출현 빈도
        return <FrequencyChart data={data?.frequency} />;
      case 1: // 최근 출현
        return <RecentAppearance data={data?.recent} />;
      case 2: // 홀짝 분석
        return <OddEvenChart data={data?.oddEven} />;
      case 3: // 구간별
        return <RangeChart data={data?.ranges} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleRow}>
              <ThemedText style={styles.headerTitle}>번호 분석</ThemedText>
              {isFromCache && (
                <View style={styles.cacheIndicator}>
                  <ThemedText style={styles.cacheText}>캐시</ThemedText>
                </View>
              )}
            </View>
            <ThemedText style={styles.headerSubtitle}>
              과거 당첨 번호의 통계적 패턴
            </ThemedText>
          </View>
          <Pressable
            onPress={refresh}
            style={styles.refreshButton}
            disabled={loading}
          >
            <IconSymbol
              name="arrow.clockwise"
              size={20}
              color={loading ? 'rgba(255,255,255,0.5)' : '#FFFFFF'}
            />
          </Pressable>
        </View>

        {/* 탭 */}
        <View style={styles.tabContainer}>
          <SegmentedControl
            segments={ANALYSIS_TABS}
            activeIndex={activeTab}
            onPress={setActiveTab}
          />
        </View>

        {/* 컨텐츠 */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.contentContainer}>
            {renderContent()}
          </ThemedView>

          <ThemedView style={styles.disclaimer}>
            <ThemedText style={styles.disclaimerText}>
              ⚠️ 로또는 매 회차 독립적인 추첨이며, 과거 결과가 미래를 예측하지
              않습니다. 통계는 참고용으로만 활용하세요.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  cacheIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cacheText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  scrollView: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: colors.error,
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: colors.textMuted,
  },
  disclaimer: {
    marginHorizontal: 16,
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
});
