import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText, ThemedView, IconSymbol } from '@/src/shared/ui/components';
import { useRouter } from 'expo-router';
import { colors } from '@/src/shared/ui/theme';

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  available?: boolean;
};

export default function FeatureMenu() {
  const router = useRouter();

  const FEATURES: FeatureItem[] = [
    {
      id: 'qr-scan',
      title: '빠른 당첨 확인',
      description: 'QR 코드 스캔으로 로또 티켓 당첨 여부 확인',
      icon: 'qrcode',
      onPress: () => router.push('/(stack)/scan'),
      available: true,
    },
    {
      id: 'analysis',
      title: '번호 분석',
      description: '번호별 출현 횟수, 홀짝 비율, 패턴 분석',
      icon: 'chart.bar',
      onPress: () => router.push('/(stack)/analysis'),
      available: true,
    },
    {
      id: 'generator',
      title: '번호 생성',
      description: '랜덤 생성 및 분석 기반 추천 번호',
      icon: 'wand.and.stars',
      onPress: () => console.log('번호 생성'),
      available: false,
    },
    {
      id: 'stores',
      title: '판매점 정보',
      description: '현재 위치 기반 판매점 찾기',
      icon: 'location',
      onPress: () => console.log('판매점 정보'),
      available: false,
    },
    {
      id: 'winning-stores',
      title: '당첨 판매점',
      description: '최근 당첨 판매점 목록 및 정보',
      icon: 'trophy',
      onPress: () => console.log('당첨 판매점'),
      available: false,
    },
  ];
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        로또 분석 도구
      </ThemedText>
      <View style={styles.grid}>
        {FEATURES.map(feature => (
          <Pressable
            key={feature.id}
            style={[styles.item, { opacity: feature.available ? 1 : 0.6 }]}
            onPress={feature.available ? feature.onPress : undefined}
            disabled={!feature.available}
          >
            <View style={styles.iconContainer}>
              <IconSymbol
                name={feature.icon as any}
                size={24}
                color={feature.available ? colors.primary : colors.textMuted}
              />
            </View>
            <View style={styles.content}>
              <ThemedText type="defaultSemiBold" style={styles.itemTitle}>
                {feature.title}
                {!feature.available && (
                  <ThemedText style={styles.comingSoon}> (준비중)</ThemedText>
                )}
              </ThemedText>
              <ThemedText style={styles.itemDescription}>
                {feature.description}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
  },
  grid: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 18,
  },
  comingSoon: {
    fontSize: 12,
    color: colors.error,
    fontWeight: 'normal',
  },
});
