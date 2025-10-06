import { useThemeColor } from '@/src/shared/lib/hooks';
import StorageService from '@/src/shared/lib/storage';
import {
  AlertButton,
  CustomAlert,
  IconSymbol,
  ThemedText,
  ThemedView,
} from '@/src/shared/ui/components';
import { colors } from '@/src/shared/ui/theme';
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const SCAN_FRAME_SIZE = Math.min(width, height) * 0.7;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message?: string;
    buttons: AlertButton[];
  }>({ title: '', buttons: [] });
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  useEffect(() => {
    // 컴포넌트 마운트 시 권한 상태 확인
    if (permission?.granted) {
      setIsScanning(true);
    }
  }, [permission]);

  const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (!isScanning) return;

    setIsScanning(false);
    setScannedData(data);

    // QR 코드 데이터 파싱 및 당첨 확인
    checkLottoResults(data);
  };

  const showAlert = (
    title: string,
    message?: string,
    buttons: AlertButton[] = []
  ) => {
    setAlertData({ title, message, buttons });
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const checkLottoResults = async (qrData: string) => {
    try {
      // QR 데이터에서 로또 번호 추출 시도
      const lottoNumbers = parseQRData(qrData);

      if (lottoNumbers === ('lottery_url' as any)) {
        // 동행복권 URL인 경우
        showAlert(
          '로또 QR 코드 인식',
          '동행복권 공식 QR 코드를 인식했습니다.\n웹사이트에서 당첨 확인을 진행하시겠습니까?',
          [
            {
              text: '다시 스캔',
              style: 'cancel',
              onPress: () => setIsScanning(true),
            },
            {
              text: '웹사이트 열기',
              onPress: () => {
                // 웹브라우저로 열기
                import('expo-web-browser').then(WebBrowser => {
                  WebBrowser.openBrowserAsync(qrData);
                });
              },
            },
          ]
        );
      } else if (lottoNumbers && Array.isArray(lottoNumbers)) {
        // 실제 당첨 번호와 비교
        await showLottoResults(lottoNumbers);
      } else {
        // QR 데이터가 로또와 관련 없는 경우
        showAlert(
          'QR 코드 인식',
          `스캔된 내용: ${qrData.substring(0, 100)}${qrData.length > 100 ? '...' : ''}\n\n로또 번호를 찾을 수 없습니다. 다시 스캔해주세요.`,
          [
            {
              text: '다시 스캔',
              style: 'cancel',
              onPress: () => setIsScanning(true),
            },
            {
              text: '내용 복사',
              onPress: () => {
                // 클립보드에 복사 (선택사항)
                console.log('QR 내용:', qrData);
                setIsScanning(true);
              },
            },
          ]
        );
      }
    } catch (error) {
      showAlert('오류', 'QR 코드를 처리하는 중 오류가 발생했습니다.', [
        {
          text: '다시 스캔',
          onPress: () => setIsScanning(true),
        },
      ]);
    }
  };

  const parseQRData = (qrData: string): number[] | null => {
    try {
      console.log('QR 데이터:', qrData); // 디버깅용

      // 1. 동행복권 URL 체크 (예: https://www.dhlottery.co.kr/qr.do?method=winQr&v=...)
      if (
        qrData.includes('dhlottery.co.kr') ||
        qrData.includes('nlotto.co.kr')
      ) {
        // QR 코드가 동행복권 URL인 경우 - 웹 크롤링이나 웹뷰 필요
        return 'lottery_url' as any; // 특별한 식별자로 처리
      }

      // 2. 직접 숫자가 포함된 QR 코드 파싱
      // 콤마나 공백으로 구분된 숫자들 추출
      const cleanData = qrData.replace(/[^\d,\s\-]/g, '');
      const numberMatch = cleanData.match(/\d+/g);

      if (numberMatch && numberMatch.length >= 6) {
        const numbers = numberMatch.slice(0, 6).map(n => parseInt(n, 10));
        // 로또 번호 범위 확인 (1-45)
        if (numbers.every(n => n >= 1 && n <= 45)) {
          return numbers.sort((a, b) => a - b);
        }
      }

      // 3. JSON 형식 시도
      if (qrData.startsWith('{') || qrData.startsWith('[')) {
        const parsed = JSON.parse(qrData);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          const numbers = parsed.slice(0, 6).map(n => parseInt(n, 10));
          if (numbers.every(n => n >= 1 && n <= 45)) {
            return numbers.sort((a, b) => a - b);
          }
        }
      }

      // 4. 다양한 형식의 QR 데이터 처리
      // "A조 1,5,12,23,34,45" 같은 형식
      const lottoPattern =
        /(?:A|B|C|D|E조)?\s*(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})[,\s]+(\d{1,2})/i;
      const match = qrData.match(lottoPattern);
      if (match) {
        const numbers = match.slice(1, 7).map(n => parseInt(n, 10));
        if (numbers.every(n => n >= 1 && n <= 45)) {
          return numbers.sort((a, b) => a - b);
        }
      }

      return null;
    } catch (error) {
      console.error('QR 파싱 에러:', error);
      return null;
    }
  };

  const showLottoResults = async (userNumbers: number[]) => {
    try {
      // 캐시된 최신 당첨 번호 가져오기
      const cachedData = await StorageService.getCachedLottoData();

      if (!cachedData) {
        showAlert(
          '데이터 없음',
          '당첨 번호 데이터를 불러올 수 없습니다.\n홈 화면에서 데이터를 먼저 확인해주세요.',
          [
            {
              text: '홈으로 이동',
              onPress: () => router.replace('/'),
            },
            {
              text: '다시 스캔',
              style: 'cancel',
              onPress: () => setIsScanning(true),
            },
          ]
        );
        return;
      }

      const winningNumbers = cachedData.data.numbers;
      const bonusNumber = cachedData.data.bonus;

      // 당첨 확인 로직
      const matchCount = userNumbers.filter(num =>
        winningNumbers.includes(num)
      ).length;
      const hasBonusMatch = userNumbers.includes(bonusNumber);

      let prize = '';
      let prizeAmount = '';

      if (matchCount === 6) {
        prize = '🎉 1등 당첨!';
        prizeAmount = cachedData.data.firstWinAmount
          ? `상금: ${cachedData.data.firstWinAmount.toLocaleString()}원`
          : '';
      } else if (matchCount === 5 && hasBonusMatch) {
        prize = '🎊 2등 당첨!';
        prizeAmount = '상금: 약 3천만원~6천만원';
      } else if (matchCount === 5) {
        prize = '🎁 3등 당첨!';
        prizeAmount = '상금: 약 150만원';
      } else if (matchCount === 4) {
        prize = '🎯 4등 당첨!';
        prizeAmount = '상금: 고정 50,000원';
      } else if (matchCount === 3) {
        prize = '🎫 5등 당첨!';
        prizeAmount = '상금: 고정 5,000원';
      } else {
        prize = '😢 아쉽게도 낙첨';
        prizeAmount = '다음 기회에 도전하세요!';
      }

      const resultMessage = `
${cachedData.data.drawNo}회차 결과
당첨번호: ${winningNumbers.join(', ')}
보너스: ${bonusNumber}

내 번호: ${userNumbers.join(', ')}
일치: ${matchCount}개${hasBonusMatch ? ' + 보너스' : ''}

${prize}
${prizeAmount}
      `.trim();

      showAlert('당첨 결과', resultMessage, [
        {
          text: '다시 스캔',
          onPress: () => setIsScanning(true),
        },
        {
          text: '확인',
          style: 'cancel',
        },
      ]);
    } catch (error) {
      showAlert('오류', '당첨 결과를 확인하는 중 오류가 발생했습니다.', [
        {
          text: '다시 스캔',
          onPress: () => setIsScanning(true),
        },
      ]);
    }
  };

  const ScanFrame = () => (
    <View style={[styles.scanFrame, { borderColor: tintColor }]}>
      <View
        style={[styles.corner, styles.topLeft, { borderColor: tintColor }]}
      />
      <View
        style={[styles.corner, styles.topRight, { borderColor: tintColor }]}
      />
      <View
        style={[styles.corner, styles.bottomLeft, { borderColor: tintColor }]}
      />
      <View
        style={[styles.corner, styles.bottomRight, { borderColor: tintColor }]}
      />
    </View>
  );

  const Header = () => (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
      </Pressable>
      <View style={styles.headerContent}>
        <ThemedText style={styles.headerTitle}>빠른 당첨 확인</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          QR 코드로 로또 당첨 여부를 확인하세요
        </ThemedText>
      </View>
    </View>
  );

  const PermissionRequest = () => (
    <ThemedView style={styles.permissionContainer}>
      <IconSymbol
        name="camera.fill"
        size={64}
        color={tintColor}
        style={styles.cameraIcon}
      />
      <ThemedText type="title" style={styles.permissionTitle}>
        카메라 권한이 필요합니다
      </ThemedText>
      <ThemedText style={styles.permissionDescription}>
        로또 용지의 QR 코드를 스캔하여{'\n'}
        당첨 번호를 빠르게 확인할 수 있습니다.
      </ThemedText>
      <Pressable
        style={[styles.permissionButton, { backgroundColor: tintColor }]}
        onPress={requestPermission}
      >
        <ThemedText style={styles.permissionButtonText}>
          카메라 권한 허용
        </ThemedText>
      </Pressable>
    </ThemedView>
  );

  const ScanInterface = () => (
    <View style={styles.scanContainer}>
      <View style={styles.scanContent}>
        <ThemedText type="title" style={styles.scanTitle}>
          QR 코드 스캔
        </ThemedText>
        <ThemedText style={styles.instruction}>
          로또 용지의 QR 코드를 스캔하세요
        </ThemedText>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={'back' as CameraType}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
        />

        {/* 오버레이와 스캔 프레임 */}
        <View style={styles.overlay}>
          {/* 상단 오버레이 */}
          <View
            style={[styles.overlayTop, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
          />

          {/* 중간 행 */}
          <View style={styles.overlayMiddle}>
            <View
              style={[
                styles.overlaySide,
                { backgroundColor: 'rgba(0,0,0,0.7)' },
              ]}
            />
            <View style={styles.scanFrameContainer}>
              <ScanFrame />
              {isScanning && <View style={styles.scanningLine} />}
            </View>
            <View
              style={[
                styles.overlaySide,
                { backgroundColor: 'rgba(0,0,0,0.7)' },
              ]}
            />
          </View>

          {/* 하단 오버레이 */}
          <View
            style={[
              styles.overlayBottom,
              { backgroundColor: 'rgba(0,0,0,0.7)' },
            ]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          {isScanning
            ? 'QR 코드를 스캔 프레임 안에 위치시켜주세요'
            : scannedData
              ? `스캔 완료: ${scannedData.substring(0, 20)}...`
              : ''}
        </ThemedText>

        <View style={styles.footerButtons}>
          {!isScanning && scannedData && (
            <Pressable
              style={[styles.actionButton, { backgroundColor: tintColor }]}
              onPress={() => {
                setScannedData(null);
                setIsScanning(true);
              }}
            >
              <ThemedText style={styles.actionButtonText}>다시 스캔</ThemedText>
            </Pressable>
          )}

          <Pressable
            style={styles.manualButton}
            onPress={() => {
              showAlert('수동 입력', '테스트용 번호를 입력하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                {
                  text: '테스트',
                  onPress: () => {
                    // 테스트용 로또 번호
                    const testNumbers = [1, 5, 12, 23, 34, 45];
                    showLottoResults(testNumbers);
                  },
                },
              ]);
            }}
          >
            <ThemedText type="link">수동으로 번호 입력</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );

  // 권한이 아직 로딩 중인 경우
  if (permission === null) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <Header />
          <ThemedView style={styles.loadingContainer}>
            <ThemedText>카메라 권한을 확인하고 있습니다...</ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // 권한이 거부된 경우
  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <Header />
          <PermissionRequest />
        </ThemedView>
      </SafeAreaView>
    );
  }

  // 권한이 허용된 경우
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        <ScanInterface />

        <CustomAlert
          visible={alertVisible}
          title={alertData.title}
          message={alertData.message}
          buttons={alertData.buttons}
          onDismiss={hideAlert}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  cameraIcon: {
    marginBottom: 24,
  },
  permissionTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionDescription: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.8,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanContainer: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_FRAME_SIZE,
  },
  overlayBottom: {
    flex: 1,
  },
  overlaySide: {
    flex: 1,
  },
  scanFrameContainer: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanContent: {
    padding: 24,
    alignItems: 'center',
  },
  scanTitle: {
    marginBottom: 8,
  },
  instruction: {
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'transparent',
    position: 'relative',
  },
  scanningLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: colors.primary,
    opacity: 0.8,
    // 애니메이션은 추후 Animated API로 구현
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 16,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  manualButton: {
    padding: 8,
  },
});
