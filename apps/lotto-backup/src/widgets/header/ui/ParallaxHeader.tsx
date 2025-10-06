import { useLotto } from '@/src/entities/lotto-draw';
import type { LottoDraw } from '@/src/shared/api';
import { formatWonShort } from '@/src/shared/api';
import { IconSymbol, ThemedText } from '@/src/shared/ui/components';
import { colors } from '@/src/shared/ui/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

type SlideContent =
  | { type: 'prize'; data: LottoDraw }
  | {
      type: 'countdown';
      data: { days: number; hours: number; minutes: number; seconds: number };
    }
  | { type: 'message'; data: string };

const MOTIVATIONAL_MESSAGES = [
  '오늘이 바로 그날! 🍀',
  '당신의 행운이 기다리고 있습니다 ✨',
  '매주 토요일, 새로운 기회가 찾아옵니다',
  '꿈을 현실로 만드는 6개의 숫자',
  '인생 역전의 순간이 다가옵니다 🎯',
  '1등 당첨까지 단 한 장!',
  '행운의 번호를 찾아보세요 🔮',
  '누군가는 당첨됩니다. 왜 당신이 아니겠어요?',
];

function getTimeUntilSaturday(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const saturday = new Date();

  // 다음 토요일 오후 8시 45분 찾기
  saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  saturday.setHours(20, 45, 0, 0);

  // 이미 지났다면 다음 주 토요일
  if (saturday <= now) {
    saturday.setDate(saturday.getDate() + 7);
  }

  const diff = saturday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export default function ParallaxHeader() {
  const { data } = useLotto();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const autoplayInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const dragStartX = useRef(0);

  // 슬라이드 컨텐츠 생성 (항상 3개로 고정)
  const slides: SlideContent[] = [];

  // 1. 당첨금 정보 슬라이드 (항상 추가, 데이터 없으면 기본값 사용)
  if (data?.firstWinAmount) {
    slides.push({ type: 'prize', data: data });
  } else {
    // 기본 당첨금 정보 (placeholder)
    slides.push({
      type: 'prize',
      data: {
        drawNo: 0,
        drawDate: new Date().toISOString().split('T')[0],
        numbers: [1, 2, 3, 4, 5, 6],
        bonus: 7,
        firstWinAmount: 2000000000,
        firstWinners: 14,
        firstTotalAmount: 28000000000,
      } as LottoDraw,
    });
  }

  // 2. 카운트다운 슬라이드
  slides.push({ type: 'countdown', data: countdown });

  // 3. 동기부여 메시지 (1개만)
  const randomMessage =
    MOTIVATIONAL_MESSAGES[
      Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
    ];
  slides.push({ type: 'message', data: randomMessage });

  // 카운트다운 업데이트 (초 단위)
  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getTimeUntilSaturday());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // Autoplay 로직
  useEffect(() => {
    if (autoplay && slides.length > 1) {
      autoplayInterval.current = setInterval(() => {
        animateSlideChange(() => {
          setCurrentSlide(prev => (prev + 1) % slides.length);
        });
      }, 6000); // 6초마다 전환

      return () => {
        if (autoplayInterval.current) {
          clearInterval(autoplayInterval.current);
        }
      };
    }
  }, [autoplay, slides.length, currentSlide]);

  const animateSlideChange = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 200);
  };

  // PanResponder로 드래그 처리
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: (_, gestureState) => {
        dragStartX.current = gestureState.x0;
        if (autoplayInterval.current) {
          clearInterval(autoplayInterval.current);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        slideAnimation.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 50;

        if (gestureState.dx > threshold) {
          // 오른쪽으로 스와이프 - 이전 슬라이드
          animateSlideChange(() => {
            setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
          });
        } else if (gestureState.dx < -threshold) {
          // 왼쪽으로 스와이프 - 다음 슬라이드
          animateSlideChange(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
          });
        }

        // 원위치로 복귀
        Animated.spring(slideAnimation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        // autoplay가 켜져있었다면 다시 시작
        if (autoplay) {
          setAutoplay(false);
          setTimeout(() => setAutoplay(true), 100);
        }
      },
    })
  ).current;

  const toggleAutoplay = () => {
    setAutoplay(!autoplay);
  };

  const currentContent: SlideContent | undefined = slides[currentSlide];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.topRow}>
        <ThemedText
          style={styles.titleText}
          lightColor="#ffffff"
          darkColor="#ffffff"
        >
          로또 6/45
        </ThemedText>
        <Pressable onPress={toggleAutoplay} style={styles.autoplayButton}>
          <IconSymbol
            name={autoplay ? 'pause.circle' : 'play.circle'}
            size={20}
            color="#ffffff"
          />
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      >
        {currentContent?.type === 'prize' && (
          <>
            <ThemedText style={styles.prizeLabel}>
              {currentContent.data.drawNo > 0
                ? `${currentContent.data.drawNo}회차 1등 당첨금`
                : '평균 1등 당첨금'}
            </ThemedText>
            <ThemedText style={styles.prizeAmount}>
              {formatWonShort(currentContent.data.firstWinAmount)}
            </ThemedText>
            <ThemedText style={styles.prizeInfo}>
              {currentContent.data.firstWinners}명 당첨
            </ThemedText>
          </>
        )}

        {currentContent?.type === 'countdown' && (
          <>
            <ThemedText style={styles.countdownLabel}>다음 추첨까지</ThemedText>
            <ThemedText style={styles.countdownTime}>
              {currentContent.data.days > 0 && `${currentContent.data.days}일 `}
              {`${String(currentContent.data.hours).padStart(2, '0')}시간 `}
              {`${String(currentContent.data.minutes).padStart(2, '0')}분 `}
              {`${String(currentContent.data.seconds).padStart(2, '0')}초`}
            </ThemedText>
            <ThemedText style={styles.countdownInfo}>
              매주 토요일 오후 8:45
            </ThemedText>
          </>
        )}

        {currentContent?.type === 'message' && (
          <ThemedText style={styles.descriptionText}>
            {currentContent.data}
          </ThemedText>
        )}
      </Animated.View>

      {/* 인디케이터를 하단 중앙으로 이동 */}
      <View style={styles.bottomIndicators}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentSlide && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  autoplayButton: {
    padding: 4,
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
  bottomIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 28,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
    lineHeight: 38,
    color: '#FFFFFF',
  },
  prizeLabel: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  prizeAmount: {
    fontSize: 36,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    lineHeight: 44,
    marginBottom: 4,
  },
  prizeInfo: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  countdownLabel: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  countdownTime: {
    fontSize: 32,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    lineHeight: 40,
    marginBottom: 4,
  },
  countdownInfo: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255,255,255,0.9)',
  },
});
