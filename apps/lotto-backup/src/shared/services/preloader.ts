import NetInfo from '@react-native-community/netinfo';
import { lottoService } from '@/src/shared/api/lotto';
import StorageService from '@/src/shared/lib/storage';
import { LottoData } from '@/src/entities/lotto-draw';
import type { AnalysisData } from '@/src/entities/analysis';

export type PreloadStatus =
  | 'loading'
  | 'success'
  | 'offline'
  | 'error'
  | 'cache-only';

export type PreloadResult = {
  status: PreloadStatus;
  data: LottoData | null;
  analysisData?: AnalysisData | null;
  isFromCache: boolean;
  isAnalysisFromCache?: boolean;
  error?: string;
};

export class PreloaderService {
  private static instance: PreloaderService;

  public static getInstance(): PreloaderService {
    if (!this.instance) {
      this.instance = new PreloaderService();
    }
    return this.instance;
  }

  /**
   * 스플래시 화면에서 실행할 메인 프리로드 함수
   */
  async preloadData(): Promise<PreloadResult> {
    try {
      // 캐시된 데이터 확인
      const cachedData = await StorageService.getCachedLottoData();
      const appSettings = await StorageService.getAppSettings();

      // 네트워크 상태 확인
      let isConnected = false;
      try {
        const networkState = await NetInfo.fetch();
        isConnected = Boolean(
          networkState.isConnected && networkState.isInternetReachable
        );
      } catch (networkError) {
        console.log('Network check failed:', networkError);
        isConnected = false;
      }

      // 오프라인 모드거나 네트워크 연결 없음
      if (!isConnected) {
        await StorageService.setOfflineMode(true);

        if (cachedData) {
          return {
            status: 'offline',
            data: cachedData.data,
            isFromCache: true,
          };
        }

        return {
          status: 'error',
          data: null,
          isFromCache: false,
          error: '네트워크 연결이 없고 캐시된 데이터도 없습니다.',
        };
      }

      // 온라인 상태
      await StorageService.setOfflineMode(false);

      // 첫 실행이거나 캐시가 없으면 무조건 다운로드
      if (appSettings.isFirstLaunch || !cachedData) {
        return await this.fetchFreshData(true);
      }

      // 캐시 유효성 확인
      const isCacheValid = await StorageService.isCacheValid();
      if (isCacheValid) {
        // 캐시가 유효하면 백그라운드에서 업데이트 확인
        this.checkForUpdatesInBackground(cachedData.drawNo);

        // 백그라운드에서 분석 데이터 준비
        this.prepareAnalysisDataInBackground();

        return {
          status: 'success',
          data: cachedData.data,
          isFromCache: true,
        };
      }

      // 캐시가 오래됨 - 새 데이터 확인 필요
      return await this.smartUpdate(cachedData);
    } catch (error) {
      console.error('Preload error:', error);

      // 에러 발생 시 캐시된 데이터라도 반환
      const cachedData = await StorageService.getCachedLottoData();
      if (cachedData) {
        return {
          status: 'error',
          data: cachedData.data,
          isFromCache: true,
          error:
            '데이터 업데이트 중 오류가 발생했습니다. 캐시된 데이터를 표시합니다.',
        };
      }

      return {
        status: 'error',
        data: null,
        isFromCache: false,
        error: '데이터를 불러올 수 없습니다.',
      };
    }
  }

  /**
   * 새로운 데이터 다운로드
   */
  private async fetchFreshData(isFirstLaunch = false): Promise<PreloadResult> {
    try {
      const latestData = await lottoService.getLatestLotto();

      if (latestData) {
        // 데이터 캐싱
        await StorageService.cacheLottoData(latestData, latestData.drawNo);

        // 첫 실행 상태 업데이트
        if (isFirstLaunch) {
          await StorageService.saveAppSettings({
            isFirstLaunch: false,
            lastUpdateCheck: Date.now(),
          });
        }

        return {
          status: 'success',
          data: latestData,
          isFromCache: false,
        };
      }

      throw new Error('Failed to fetch latest data');
    } catch (error) {
      console.error('Fresh data fetch error:', error);
      throw error;
    }
  }

  /**
   * 스마트 업데이트 - 새 회차가 있을 때만 업데이트
   */
  private async smartUpdate(cachedData: {
    data: LottoData;
    drawNo: number;
  }): Promise<PreloadResult> {
    try {
      // 최신 회차 번호만 먼저 확인
      const latestDrawNumber = await lottoService.getLatestDrawNumber();

      // 캐시된 데이터가 최신이면 그대로 사용
      if (latestDrawNumber <= cachedData.drawNo) {
        await StorageService.saveAppSettings({
          lastUpdateCheck: Date.now(),
        });

        return {
          status: 'success',
          data: cachedData.data,
          isFromCache: true,
        };
      }

      // 새 회차 있음 - 최신 데이터 다운로드
      const freshData = await this.fetchFreshData();
      return freshData;
    } catch (error) {
      console.error('Smart update error:', error);

      // 업데이트 실패 시 캐시 데이터 사용
      return {
        status: 'success',
        data: cachedData.data,
        isFromCache: true,
      };
    }
  }

  /**
   * 백그라운드에서 업데이트 확인 (non-blocking)
   */
  private async checkForUpdatesInBackground(
    currentDrawNo: number
  ): Promise<void> {
    try {
      // 비동기로 실행하여 UI 블로킹 방지
      setTimeout(async () => {
        try {
          const latestDrawNumber = await lottoService.getLatestDrawNumber();

          if (latestDrawNumber > currentDrawNo) {
            // 새 데이터가 있으면 미리 캐시 업데이트
            const latestData = await lottoService.getLatestLotto();
            if (latestData) {
              await StorageService.cacheLottoData(
                latestData,
                latestData.drawNo
              );
              console.log('Background cache updated to draw', latestDrawNumber);
            }
          }

          await StorageService.saveAppSettings({
            lastUpdateCheck: Date.now(),
          });
        } catch (error) {
          console.error('Background update check failed:', error);
        }
      }, 2000); // 2초 후 실행
    } catch (error) {
      console.error('Background check error:', error);
    }
  }

  /**
   * 백그라운드에서 분석 데이터 미리 준비 (non-blocking)
   */
  private async prepareAnalysisDataInBackground(): Promise<void> {
    try {
      // 비동기로 실행하여 UI 블로킹 방지
      setTimeout(async () => {
        try {
          // 분석 캐시 유효성 확인
          const isAnalysisCacheValid =
            await StorageService.isAnalysisCacheValid();
          if (isAnalysisCacheValid) {
            return; // 분석 캐시가 유효하면 건너뛰기
          }

          console.log('Background analysis data preparation started...');

          // TODO: 실제 분석 로직을 여기서 실행하거나
          // 분석 화면에서 사용할 수 있도록 미리 데이터만 확인
          // 현재는 캐시만 확인하고 실제 분석은 useAnalysis에서 처리
        } catch (error) {
          console.error('Background analysis preparation failed:', error);
        }
      }, 1000); // 1초 후 실행
    } catch (error) {
      console.error('Background analysis setup error:', error);
    }
  }

  /**
   * 캐시 강제 새로고침
   */
  async forceRefresh(): Promise<PreloadResult> {
    try {
      return await this.fetchFreshData();
    } catch (error) {
      const cachedData = await StorageService.getCachedLottoData();
      if (cachedData) {
        return {
          status: 'error',
          data: cachedData.data,
          isFromCache: true,
          error: '새로고침 실패. 캐시된 데이터를 표시합니다.',
        };
      }

      throw error;
    }
  }
}

export const preloaderService = PreloaderService.getInstance();
