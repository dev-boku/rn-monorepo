import { useCallback, useEffect, useState } from 'react';
import {
  preloaderService,
  PreloadResult,
} from '@/src/shared/services/preloader';

export type SplashState = {
  isLoading: boolean;
  isReady: boolean;
  status: 'loading' | 'success' | 'error' | 'offline';
  statusText: string;
  progress: number;
  error?: string;
  preloadResult?: PreloadResult;
};

export function useSplashPreload() {
  const [state, setState] = useState<SplashState>({
    isLoading: true,
    isReady: false,
    status: 'loading',
    statusText: '앱을 준비하고 있습니다...',
    progress: 0,
  });

  const updateProgress = useCallback(
    (progress: number, statusText?: string) => {
      setState(prev => ({
        ...prev,
        progress: Math.min(1, Math.max(0, progress)),
        statusText: statusText || prev.statusText,
      }));
    },
    []
  );

  const performPreload = useCallback(async () => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isReady: false,
        status: 'loading',
        error: undefined,
      }));

      // 단계 1: 앱 초기화
      updateProgress(0.1, '앱을 초기화하고 있습니다...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // 단계 2: 네트워크 상태 확인
      updateProgress(0.2, '네트워크 상태를 확인하고 있습니다...');
      await new Promise(resolve => setTimeout(resolve, 200));

      // 단계 3: 캐시된 데이터 확인
      updateProgress(0.3, '캐시된 데이터를 확인하고 있습니다...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // 단계 4: 데이터 프리로딩
      updateProgress(0.4, '로또 데이터를 불러오고 있습니다...');
      const preloadResult = await preloaderService.preloadData();

      // 단계 5: 결과 처리
      updateProgress(0.7, '데이터를 처리하고 있습니다...');
      await new Promise(resolve => setTimeout(resolve, 400));

      // 단계 6: 완료 처리
      updateProgress(0.9, '준비를 완료하고 있습니다...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // 결과에 따른 상태 설정
      let finalStatus: SplashState['status'] = 'success';
      let finalStatusText = '준비 완료!';

      if (preloadResult.status === 'error') {
        finalStatus = 'error';
        finalStatusText = preloadResult.error || '오류가 발생했습니다';
      } else if (preloadResult.status === 'offline') {
        finalStatus = 'offline';
        finalStatusText = '오프라인 모드로 시작합니다';
      } else if (preloadResult.isFromCache) {
        finalStatusText = '캐시된 데이터로 시작합니다';
      }

      updateProgress(1.0, finalStatusText);

      // 완료 상태로 전환
      setState(prev => ({
        ...prev,
        isLoading: false,
        isReady: true,
        status: finalStatus,
        statusText: finalStatusText,
        progress: 1.0,
        preloadResult,
      }));
    } catch (error) {
      console.error('Splash preload error:', error);

      setState(prev => ({
        ...prev,
        isLoading: false,
        isReady: false,
        status: 'error',
        statusText: '초기화 중 오류가 발생했습니다',
        progress: 0,
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  }, [updateProgress]);

  const retry = useCallback(() => {
    performPreload();
  }, [performPreload]);

  const skipToApp = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      isReady: true,
      status: 'success',
      statusText: '앱을 시작합니다',
      progress: 1.0,
    }));
  }, []);

  // 초기 프리로드 실행 - 한 번만 실행되도록 수정
  useEffect(() => {
    let mounted = true;

    const runPreload = async () => {
      if (mounted) {
        await performPreload();
      }
    };

    runPreload();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열로 한 번만 실행

  return {
    ...state,
    retry,
    skipToApp,
  };
}
