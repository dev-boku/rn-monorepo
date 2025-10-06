import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { ThemedText, ThemedView } from '@/src/shared/ui/components';
import { colors } from '@/src/shared/ui/theme';

export type SplashScreenProps = {
  onComplete: () => void;
  status: 'loading' | 'success' | 'error' | 'offline';
  statusText?: string;
  progress?: number; // 0 to 1
};

export default function SplashScreen({
  onComplete,
  status,
  statusText,
  progress = 0,
}: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 초기 애니메이션 시작
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // 로고 회전 애니메이션 (로딩 중일 때)
    const rotateAnimation = Animated.loop(
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    if (status === 'loading') {
      rotateAnimation.start();
    }

    return () => rotateAnimation.stop();
  }, [status, fadeAnim, scaleAnim, logoRotateAnim]);

  useEffect(() => {
    // 프로그레스 애니메이션
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    // 완료 시 fadeOut 후 콜백 실행
    if (status === 'success') {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            onComplete();
          }
        });
      }, 1000);
    }
  }, [status, fadeAnim, onComplete]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return colors.primary;
      case 'success':
        return colors.lotto.green;
      case 'error':
        return colors.error;
      case 'offline':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return '🎲';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'offline':
        return '📱';
      default:
        return '🎲';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logo,
              {
                transform: [
                  { rotate: status === 'loading' ? logoRotation : '0deg' },
                ],
              },
            ]}
          >
            <ThemedText style={[styles.logoIcon, { color: getStatusColor() }]}>
              {getStatusIcon()}
            </ThemedText>
          </Animated.View>

          <View style={styles.logoTextContainer}>
            <ThemedText type="title" style={styles.logoText}>
              로또 분석기
            </ThemedText>
            <ThemedText style={styles.logoSubText}>
              당첨 번호 분석 및 확인
            </ThemedText>
          </View>
        </View>

        {/* 상태 표시 영역 */}
        <View style={styles.statusContainer}>
          {status === 'loading' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={getStatusColor()}
                style={styles.spinner}
              />

              {/* 프로그레스 바 */}
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: getStatusColor(),
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <ThemedText style={[styles.statusText, { color: getStatusColor() }]}>
            {statusText || getDefaultStatusText(status)}
          </ThemedText>
        </View>

        {/* 버전 정보 */}
        <View style={styles.footer}>
          <ThemedText style={styles.versionText}>v1.0.0</ThemedText>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

function getDefaultStatusText(status: string): string {
  switch (status) {
    case 'loading':
      return '데이터를 불러오고 있습니다...';
    case 'success':
      return '준비 완료!';
    case 'error':
      return '오류가 발생했습니다';
    case 'offline':
      return '오프라인 모드';
    default:
      return '로딩 중...';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 48,
  },
  logoTextContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoSubText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  progressBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.7,
  },
});
