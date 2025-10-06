import { useCallback, useEffect, useState } from 'react';
import { fetchDraw, calculateLatestDrawNo } from '@/src/shared/api';
import StorageService from '@/src/shared/lib/storage';

export type FrequencyData = {
  number: number;
  count: number;
  percentage: number;
}[];

export type RecentData = {
  number: number;
  lastDrawNo: number;
  gap: number; // 몇 회차 전에 나왔는지
}[];

export type OddEvenData = {
  oddCount: number;
  evenCount: number;
  patterns: {
    drawNo: number;
    odd: number;
    even: number;
  }[];
};

export type RangeData = {
  range: string;
  count: number;
  percentage: number;
}[];

export type AnalysisData = {
  frequency: FrequencyData;
  recent: RecentData;
  oddEven: OddEvenData;
  ranges: RangeData;
  totalDraws: number;
  lastUpdated: number;
};

export function useAnalysis() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const analyzeDraws = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const latestDrawNo = calculateLatestDrawNo();

      // 1. 먼저 캐시된 분석 데이터 확인
      const cachedAnalysis = await StorageService.getCachedAnalysisData();
      if (cachedAnalysis && !data) {
        setData(cachedAnalysis.data);
        setIsFromCache(true);
      }

      // 2. 캐시 유효성 확인
      const isCacheValid = await StorageService.isAnalysisCacheValid();

      // 캐시가 유효하고 최신 회차와 동일하면 캐시 사용
      if (
        isCacheValid &&
        cachedAnalysis &&
        cachedAnalysis.lastUpdated >= latestDrawNo
      ) {
        if (!data) {
          setData(cachedAnalysis.data);
          setIsFromCache(true);
        }
        setLoading(false);
        return;
      }

      // 3. 새로운 분석 데이터 생성 필요
      const recentCount = 50; // 최근 50회차 분석
      const startNo = Math.max(1, latestDrawNo - recentCount + 1);

      // 최근 50회차 데이터 가져오기
      const draws = [];
      for (let i = startNo; i <= latestDrawNo; i++) {
        try {
          const draw = await fetchDraw(i);
          draws.push(draw);
        } catch {
          // 특정 회차 실패 시 건너뛰기
          console.log(`Failed to fetch draw ${i}`);
        }
      }

      if (draws.length === 0) {
        throw new Error('분석할 데이터가 없습니다');
      }

      // 1. 번호별 출현 빈도 계산
      const frequencyMap = new Map<number, number>();
      const lastSeenMap = new Map<number, number>();

      // 초기화
      for (let i = 1; i <= 45; i++) {
        frequencyMap.set(i, 0);
        lastSeenMap.set(i, 0);
      }

      // 각 회차별로 처리
      draws.forEach(draw => {
        [...draw.numbers, draw.bonus].forEach(num => {
          frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
          lastSeenMap.set(
            num,
            Math.max(lastSeenMap.get(num) || 0, draw.drawNo)
          );
        });
      });

      // 빈도 데이터 생성
      const frequency: FrequencyData = Array.from(frequencyMap.entries())
        .map(([number, count]) => ({
          number,
          count,
          percentage: (count / (draws.length * 7)) * 100, // 7개 번호(6+보너스)
        }))
        .sort((a, b) => b.count - a.count);

      // 2. 최근 출현 데이터
      const recent: RecentData = Array.from(lastSeenMap.entries())
        .map(([number, lastDrawNo]) => ({
          number,
          lastDrawNo,
          gap: lastDrawNo > 0 ? latestDrawNo - lastDrawNo : 999,
        }))
        .sort((a, b) => a.gap - b.gap);

      // 3. 홀짝 분석
      const oddEvenPatterns = draws.slice(-20).map(draw => {
        const odd = draw.numbers.filter(n => n % 2 === 1).length;
        const even = draw.numbers.filter(n => n % 2 === 0).length;
        return { drawNo: draw.drawNo, odd, even };
      });

      const totalOdd = oddEvenPatterns.reduce((sum, p) => sum + p.odd, 0);
      const totalEven = oddEvenPatterns.reduce((sum, p) => sum + p.even, 0);

      const oddEven: OddEvenData = {
        oddCount: totalOdd,
        evenCount: totalEven,
        patterns: oddEvenPatterns,
      };

      // 4. 구간별 분석
      const rangeMap = new Map<string, number>([
        ['1-10', 0],
        ['11-20', 0],
        ['21-30', 0],
        ['31-40', 0],
        ['41-45', 0],
      ]);

      draws.forEach(draw => {
        draw.numbers.forEach(num => {
          if (num <= 10) rangeMap.set('1-10', (rangeMap.get('1-10') || 0) + 1);
          else if (num <= 20)
            rangeMap.set('11-20', (rangeMap.get('11-20') || 0) + 1);
          else if (num <= 30)
            rangeMap.set('21-30', (rangeMap.get('21-30') || 0) + 1);
          else if (num <= 40)
            rangeMap.set('31-40', (rangeMap.get('31-40') || 0) + 1);
          else rangeMap.set('41-45', (rangeMap.get('41-45') || 0) + 1);
        });
      });

      const totalRangeCount = draws.length * 6; // 6개 번호
      const ranges: RangeData = Array.from(rangeMap.entries()).map(
        ([range, count]) => ({
          range,
          count,
          percentage: (count / totalRangeCount) * 100,
        })
      );

      const analysisData: AnalysisData = {
        frequency,
        recent,
        oddEven,
        ranges,
        totalDraws: draws.length,
        lastUpdated: latestDrawNo,
      };

      setData(analysisData);
      setIsFromCache(false);

      // 새로운 분석 데이터를 캐시에 저장
      await StorageService.cacheAnalysisData(analysisData);
    } catch (e) {
      console.error('Analysis error:', e);
      setError(e instanceof Error ? e.message : '분석 중 오류 발생');

      // 오류 발생 시에도 캐시된 데이터가 있으면 사용
      if (!data) {
        const fallbackCache = await StorageService.getCachedAnalysisData();
        if (fallbackCache) {
          setData(fallbackCache.data);
          setIsFromCache(true);
          setError('최신 데이터 업데이트 실패. 캐시된 데이터를 표시합니다.');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    analyzeDraws();
  }, [analyzeDraws]);

  return {
    data,
    loading,
    error,
    isFromCache,
    refresh: analyzeDraws,
  } as const;
}
