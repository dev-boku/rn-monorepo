import {
  calculateLatestDrawNo,
  fetchDraw,
  fetchLatestDraw,
  LottoDraw,
} from '@/src/shared/api';
import StorageService from '@/src/shared/lib/storage';
import { useCallback, useMemo, useState } from 'react';

export function useLotto() {
  const [current, setCurrent] = useState<LottoDraw | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const drawNo = current?.drawNo ?? null;
  const maxDrawNo = useMemo(() => calculateLatestDrawNo(), []);

  const loadLatest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 먼저 캐시된 데이터 확인 (빠른 초기 로딩)
      const cachedData = await StorageService.getCachedLottoData();
      if (cachedData && !current) {
        setCurrent(cachedData.data);
        setIsFromCache(true);
      }

      // 네트워크에서 최신 데이터 시도
      try {
        const latest = await fetchLatestDraw();
        setCurrent(latest);
        setIsFromCache(false);

        // 새 데이터를 캐시에 저장
        await StorageService.cacheLottoData(latest, latest.drawNo);
      } catch (networkError) {
        console.log('Network fetch failed, using cached data if available');
        if (!current && !cachedData) {
          throw networkError;
        }
        // 캐시된 데이터가 있으면 네트워크 오류 무시
        if (cachedData && !current) {
          setCurrent(cachedData.data);
          setIsFromCache(true);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [current]);

  const loadByNo = useCallback(async (no: number) => {
    setLoading(true);
    setError(null);
    try {
      const draw = await fetchDraw(no);
      setCurrent(draw);
      setIsFromCache(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // 프리로드된 데이터로 초기화하는 메서드
  const initializeWithPreloadedData = useCallback(
    (preloadedData: LottoDraw, fromCache = false) => {
      setCurrent(preloadedData);
      setIsFromCache(fromCache);
      setError(null);
      setLoading(false);
    },
    []
  );

  const canPrev = useMemo(() => (drawNo ? drawNo > 1 : false), [drawNo]);
  const canNext = useMemo(
    () => (drawNo ? drawNo < maxDrawNo : false),
    [drawNo, maxDrawNo]
  );

  const goPrev = useCallback(() => {
    if (!drawNo) return;
    loadByNo(drawNo - 1);
  }, [drawNo, loadByNo]);

  const goNext = useCallback(() => {
    if (!drawNo || drawNo >= maxDrawNo) return;
    loadByNo(drawNo + 1);
  }, [drawNo, maxDrawNo, loadByNo]);

  // 프리로드 시에는 자동 로딩 비활성화
  const autoLoad = useCallback(() => {
    loadLatest();
  }, [loadLatest]);

  return {
    data: current,
    loading,
    error,
    drawNo,
    maxDrawNo,
    isFromCache,
    loadLatest,
    loadByNo,
    initializeWithPreloadedData,
    autoLoad,
    goPrev,
    goNext,
    canPrev,
    canNext,
  } as const;
}
