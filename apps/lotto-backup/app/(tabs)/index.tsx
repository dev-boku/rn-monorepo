import React from 'react';

import { ParallaxScrollView, ParallaxHeader } from '@/src/widgets/header';
import { LatestDrawCard, InsightBanner } from '@/src/widgets/draw-card';
import { FeatureMenu } from '@/src/widgets/menu';
import { ThemedText, ThemedView } from '@/src/shared/ui/components';
import { useLotto } from '@/src/entities/lotto-draw';
import type { LottoDraw } from '@/src/shared/api';
import { colors } from '@/src/shared/ui/theme';

export default function HomeScreen() {
  const {
    data,
    loading,
    error,
    goPrev,
    goNext,
    loadLatest,
    canPrev,
    canNext,
    autoLoad,
  } = useLotto();

  // 컴포넌트 마운트 시 자동 로딩 (프리로드된 데이터가 없을 경우)
  React.useEffect(() => {
    if (!data) {
      autoLoad();
    }
  }, [data, autoLoad]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colors.primary, dark: colors.primary }}
      headerImage={<ParallaxHeader />}
      stickyHeader={
        <StickyHeader
          draw={data}
          loading={loading}
          error={error}
          onPrev={goPrev}
          onNext={goNext}
          onReload={loadLatest}
          canPrev={canPrev}
          canNext={canNext}
        />
      }
    >
      <InsightBanner />

      <FeatureMenu />

      {/* 스크롤 컨텐츠 길이를 늘려 Parallax 효과 확인을 쉽게 함 */}
      <ThemedView style={{ height: 600 }} />
    </ParallaxScrollView>
  );
}

type StickyProps = {
  draw?: LottoDraw | null;
  loading?: boolean;
  error?: string | null;
  onPrev?: () => void;
  onNext?: () => void;
  onReload?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
};
function StickyHeader({
  draw,
  loading,
  error,
  onPrev,
  onNext,
  onReload,
  canPrev,
  canNext,
}: StickyProps) {
  return (
    <ThemedView
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.05)',
      }}
    >
      <LatestDrawCard
        draw={draw}
        onPrev={onPrev}
        onNext={onNext}
        onReload={onReload}
        loading={loading}
        canPrev={canPrev}
        canNext={canNext}
      />
      {error ? (
        <ThemedText
          type="defaultSemiBold"
          style={{
            color: '#ef4444',
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          {error}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}
