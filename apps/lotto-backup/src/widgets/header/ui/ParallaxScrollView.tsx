import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { useColorScheme } from '@/src/shared/lib/hooks/useColorScheme';
import { useBottomTabOverflow } from '@/src/shared/ui/components/TabBarBackground';
import { ThemedView } from '@/src/shared/ui/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 220;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  stickyHeader?: ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  stickyHeader,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: headerBackgroundColor[colorScheme], flex: 1 }}
      >
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          scrollIndicatorInsets={{ bottom }}
          contentContainerStyle={{ paddingBottom: bottom }}
          stickyHeaderIndices={stickyHeader ? [1] : undefined}
        >
          <Animated.View
            style={[
              styles.header,
              { backgroundColor: headerBackgroundColor[colorScheme] },
              headerAnimatedStyle,
            ]}
          >
            {headerImage}
          </Animated.View>
          {stickyHeader ? (
            <ThemedView style={styles.stickyContainer}>
              {stickyHeader}
            </ThemedView>
          ) : null}
          <ThemedView style={styles.content}>{children}</ThemedView>
        </Animated.ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  stickyContainer: {
    zIndex: 10,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowRadius: 4,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flex: 1,
    padding: 8,
    gap: 16,
    overflow: 'hidden',
  },
});
