import StorageService from '@/src/shared/lib/storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  isOfflineMode: boolean;
  canRefresh: boolean;
};

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: false,
    isInternetReachable: null,
    type: null,
    isOfflineMode: false,
    canRefresh: false,
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeNetworkStatus = async () => {
      try {
        // 초기 오프라인 모드 상태 확인
        const isOfflineMode = await StorageService.isOfflineMode();

        // 네트워크 상태 구독
        unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
          const isConnected = state.isConnected ?? false;
          const isInternetReachable = state.isInternetReachable;
          const hasInternet = isConnected && (isInternetReachable ?? false);

          setNetworkStatus({
            isConnected,
            isInternetReachable,
            type: state.type,
            isOfflineMode: !hasInternet || isOfflineMode,
            canRefresh: hasInternet,
          });

          // 네트워크 상태에 따른 오프라인 모드 자동 업데이트
          if (hasInternet && isOfflineMode) {
            // 네트워크가 복구되면 오프라인 모드 해제
            StorageService.setOfflineMode(false);
            setNetworkStatus(prev => ({
              ...prev,
              isOfflineMode: false,
            }));
          } else if (!hasInternet) {
            // 네트워크 연결이 없으면 오프라인 모드 활성화
            StorageService.setOfflineMode(true);
          }
        });

        // 초기 네트워크 상태 확인
        const initialState = await NetInfo.fetch();
        const isConnected = initialState.isConnected ?? false;
        const isInternetReachable = initialState.isInternetReachable;
        const hasInternet = isConnected && (isInternetReachable ?? false);

        setNetworkStatus({
          isConnected,
          isInternetReachable,
          type: initialState.type,
          isOfflineMode: !hasInternet || isOfflineMode,
          canRefresh: hasInternet,
        });
      } catch (error) {
        console.error('Failed to initialize network status:', error);
        // 오류 발생 시 안전한 기본값 설정
        setNetworkStatus({
          isConnected: false,
          isInternetReachable: false,
          type: null,
          isOfflineMode: true,
          canRefresh: false,
        });
      }
    };

    initializeNetworkStatus();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const toggleOfflineMode = async (forceOffline?: boolean) => {
    try {
      const newOfflineMode = forceOffline ?? !networkStatus.isOfflineMode;
      await StorageService.setOfflineMode(newOfflineMode);

      setNetworkStatus(prev => ({
        ...prev,
        isOfflineMode: newOfflineMode,
      }));

      return newOfflineMode;
    } catch (error) {
      console.error('Failed to toggle offline mode:', error);
      return networkStatus.isOfflineMode;
    }
  };

  const refreshNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable;
      const hasInternet = isConnected && (isInternetReachable ?? false);
      const currentOfflineMode = await StorageService.isOfflineMode();

      setNetworkStatus({
        isConnected,
        isInternetReachable,
        type: state.type,
        isOfflineMode: !hasInternet || currentOfflineMode,
        canRefresh: hasInternet,
      });

      return hasInternet;
    } catch (error) {
      console.error('Failed to refresh network status:', error);
      return false;
    }
  };

  return {
    ...networkStatus,
    toggleOfflineMode,
    refreshNetworkStatus,
  };
}
