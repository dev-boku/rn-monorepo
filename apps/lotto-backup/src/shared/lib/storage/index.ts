import type { AnalysisData } from '@/src/entities/analysis';
import { LottoData } from '@/src/entities/lotto-draw';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CachedData = {
  data: LottoData;
  timestamp: number;
  drawNo: number;
};

type CachedAnalysisData = {
  data: AnalysisData;
  timestamp: number;
  lastUpdated: number;
};

type AppSettings = {
  lastUpdateCheck: number;
  isFirstLaunch: boolean;
};

const STORAGE_KEYS = {
  LOTTO_DATA: 'lotto_data',
  ANALYSIS_DATA: 'analysis_data',
  APP_SETTINGS: 'app_settings',
  OFFLINE_MODE: 'offline_mode',
} as const;

class StorageService {
  // 로또 데이터 캐싱
  static async cacheLottoData(data: LottoData, drawNo: number): Promise<void> {
    try {
      const cachedData: CachedData = {
        data,
        timestamp: Date.now(),
        drawNo,
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.LOTTO_DATA,
        JSON.stringify(cachedData)
      );
    } catch (error) {
      console.error('Failed to cache lotto data:', error);
    }
  }

  // 캐시된 로또 데이터 조회
  static async getCachedLottoData(): Promise<CachedData | null> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.LOTTO_DATA);
      if (!cached) return null;

      const data: CachedData = JSON.parse(cached);
      return data;
    } catch (error) {
      console.error('Failed to get cached lotto data:', error);
      return null;
    }
  }

  // 앱 설정 저장
  static async saveAppSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const current = await this.getAppSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(
        STORAGE_KEYS.APP_SETTINGS,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Failed to save app settings:', error);
    }
  }

  // 앱 설정 조회
  static async getAppSettings(): Promise<AppSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (!settings) {
        return {
          lastUpdateCheck: 0,
          isFirstLaunch: true,
        };
      }
      return JSON.parse(settings);
    } catch (error) {
      console.error('Failed to get app settings:', error);
      return {
        lastUpdateCheck: 0,
        isFirstLaunch: true,
      };
    }
  }

  // 오프라인 모드 설정
  static async setOfflineMode(isOffline: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_MODE,
        JSON.stringify(isOffline)
      );
    } catch (error) {
      console.error('Failed to set offline mode:', error);
    }
  }

  // 오프라인 모드 확인
  static async isOfflineMode(): Promise<boolean> {
    try {
      const offline = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_MODE);
      return offline ? JSON.parse(offline) : false;
    } catch (error) {
      console.error('Failed to check offline mode:', error);
      return false;
    }
  }

  // 캐시 데이터가 최신인지 확인 (24시간 기준)
  static async isCacheValid(): Promise<boolean> {
    try {
      const cached = await this.getCachedLottoData();
      if (!cached) return false;

      const now = Date.now();
      const cacheAge = now - cached.timestamp;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      return cacheAge < twentyFourHours;
    } catch (error) {
      console.error('Failed to check cache validity:', error);
      return false;
    }
  }

  // 분석 데이터 캐싱
  static async cacheAnalysisData(data: AnalysisData): Promise<void> {
    try {
      const cachedData: CachedAnalysisData = {
        data,
        timestamp: Date.now(),
        lastUpdated: data.lastUpdated,
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYSIS_DATA,
        JSON.stringify(cachedData)
      );
    } catch (error) {
      console.error('Failed to cache analysis data:', error);
    }
  }

  // 캐시된 분석 데이터 조회
  static async getCachedAnalysisData(): Promise<CachedAnalysisData | null> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS_DATA);
      if (!cached) return null;

      const data: CachedAnalysisData = JSON.parse(cached);
      return data;
    } catch (error) {
      console.error('Failed to get cached analysis data:', error);
      return null;
    }
  }

  // 분석 캐시 유효성 확인 (6시간 기준)
  static async isAnalysisCacheValid(): Promise<boolean> {
    try {
      const cached = await this.getCachedAnalysisData();
      if (!cached) return false;

      const now = Date.now();
      const cacheAge = now - cached.timestamp;
      const sixHours = 6 * 60 * 60 * 1000;

      return cacheAge < sixHours;
    } catch (error) {
      console.error('Failed to check analysis cache validity:', error);
      return false;
    }
  }

  // 저장소 초기화
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export default StorageService;
