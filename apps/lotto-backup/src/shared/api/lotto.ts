import { Platform } from 'react-native';

export type LottoApiRaw = {
  returnValue?: string;
  drwNo?: number;
  drwNoDate?: string; // YYYY-MM-DD
  drwtNo1?: number;
  drwtNo2?: number;
  drwtNo3?: number;
  drwtNo4?: number;
  drwtNo5?: number;
  drwtNo6?: number;
  bnusNo?: number;
  firstPrzwnerCo?: number; // 1등 당첨자 수
  firstWinamnt?: number; // 1등 1인당 당첨금액
  firstAccumamnt?: number; // 1등 총 당첨금액
};

export type LottoDraw = {
  drawNo: number;
  drawDate: string; // YYYY-MM-DD
  numbers: number[]; // 6 numbers ascending
  bonus: number;
  firstWinners?: number;
  firstWinAmount?: number; // per winner
  firstTotalAmount?: number; // total
};

const BASE_URL = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber';

export async function fetchDraw(drwNo: number): Promise<LottoDraw> {
  const url = `${BASE_URL}&drwNo=${encodeURIComponent(drwNo)}`;
  const res = await fetch(url, {
    headers: {
      // Avoid caches in dev on native
      'Cache-Control': Platform.select({
        ios: 'no-cache',
        android: 'no-cache',
        default: 'no-cache',
      })!,
    },
  });
  if (!res.ok) {
    throw new Error(`네트워크 오류: ${res.status}`);
  }
  const data = (await res.json()) as LottoApiRaw;
  if (!data || data.returnValue !== 'success') {
    throw new Error('회차 정보를 불러오지 못했습니다.');
  }
  return mapApiToDraw(data);
}

export async function fetchLatestDraw(): Promise<LottoDraw> {
  // 최신 회차 번호 계산
  const latestDrawNo = calculateLatestDrawNo();

  // 시도 1: 계산된 최신 회차 조회
  try {
    const draw = await fetchDraw(latestDrawNo);
    return draw;
  } catch (e) {
    console.log(`Failed to fetch draw ${latestDrawNo}:`, e);
  }

  // 시도 2: 최신 회차에서 역방향 조회 (최대 5회차 전까지)
  for (let i = 1; i <= 5; i++) {
    try {
      const draw = await fetchDraw(latestDrawNo - i);
      return draw;
    } catch {
      // continue
    }
  }

  throw new Error('최신 회차 정보를 찾지 못했습니다.');
}

function mapApiToDraw(raw: LottoApiRaw): LottoDraw {
  const numbers = [
    raw.drwtNo1!,
    raw.drwtNo2!,
    raw.drwtNo3!,
    raw.drwtNo4!,
    raw.drwtNo5!,
    raw.drwtNo6!,
  ]
    .filter((n): n is number => typeof n === 'number')
    .sort((a, b) => a - b);

  return {
    drawNo: raw.drwNo!,
    drawDate: raw.drwNoDate || '',
    numbers,
    bonus: raw.bnusNo || 0,
    firstWinners: raw.firstPrzwnerCo,
    firstWinAmount: raw.firstWinamnt,
    firstTotalAmount: raw.firstAccumamnt,
  };
}

export function formatWonShort(amount?: number): string {
  if (!amount || amount <= 0) return '-';
  // 억 단위 축약
  const eok = amount / 100_000_000;
  if (eok >= 1) {
    return `${eok.toFixed(eok >= 10 ? 0 : 1)}억`;
  }
  // 만 단위까지만 노출
  const man = amount / 10_000;
  if (man >= 1) {
    return `${man.toFixed(man >= 10 ? 0 : 1)}만`;
  }
  return `${amount.toLocaleString()}원`;
}

export function calculateLatestDrawNo(today: Date = new Date()): number {
  // 로또 1회차: 2002년 12월 7일 (토요일)
  const firstDrawDate = new Date('2002-12-07');

  // 가장 최근 토요일 찾기
  const dayOfWeek = today.getDay(); // 0=일요일, 6=토요일
  const daysSinceLastSaturday = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  const lastSaturday = new Date(today);
  lastSaturday.setDate(today.getDate() - daysSinceLastSaturday);

  // 첫 회차부터 지난 주 수 계산
  const weeksDiff = Math.floor(
    (lastSaturday.getTime() - firstDrawDate.getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );

  // 1회차부터 시작하므로 +1
  return Math.max(1, weeksDiff + 1);
}

/**
 * 최신 회차 번호만 효율적으로 가져오기 (데이터는 제외)
 */
export async function fetchLatestDrawNumber(): Promise<number> {
  const calculatedLatest = calculateLatestDrawNo();

  // 계산된 회차부터 역순으로 확인
  for (
    let drawNo = calculatedLatest;
    drawNo >= Math.max(1, calculatedLatest - 5);
    drawNo--
  ) {
    try {
      const url = `${BASE_URL}&drwNo=${encodeURIComponent(drawNo)}`;
      const res = await fetch(url, {
        headers: {
          'Cache-Control': Platform.select({
            ios: 'no-cache',
            android: 'no-cache',
            default: 'no-cache',
          })!,
        },
      });

      if (res.ok) {
        const data = (await res.json()) as LottoApiRaw;
        if (data && data.returnValue === 'success' && data.drwNo) {
          return data.drwNo;
        }
      }
    } catch (error) {
      console.log(`Failed to check draw ${drawNo}:`, error);
    }
  }

  // 모든 시도 실패 시 계산된 값에서 1 빼기
  return Math.max(1, calculatedLatest - 1);
}

// 통합 로또 서비스 객체
export const lottoService = {
  getLatestLotto: fetchLatestDraw,
  getLottoByDrawNo: fetchDraw,
  getLatestDrawNumber: fetchLatestDrawNumber,
  calculateLatestDrawNo,
};
