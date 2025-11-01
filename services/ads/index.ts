import Constants from 'expo-constants';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

// 광고 단위 ID
const adUnitId =
  Constants.expoConfig?.extra?.admobInterstitialAdUnitId ||
  'ca-app-pub-8287266902600032/7703180481';

// 전면 광고 인스턴스 생성
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: false,
});

let isAdLoaded = false;
let isAdLoading = false;
let retryCount = 0;
const MAX_RETRIES = 3;

// 광고 이벤트 리스너
interstitial.addAdEventListener(AdEventType.LOADED, () => {
  isAdLoaded = true;
  isAdLoading = false;
  retryCount = 0; // 성공 시 재시도 카운트 리셋
});

interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  isAdLoaded = false;
  retryCount = 0; // 광고 닫힐 때 재시도 카운트 리셋
  // 광고가 닫히면 다음 광고를 미리 로드
  loadInterstitialAd();
});

interstitial.addAdEventListener(AdEventType.ERROR, (_error) => {
  isAdLoaded = false;
  isAdLoading = false;

  // 지수 백오프로 재시도 (최대 3회)
  if (retryCount < MAX_RETRIES) {
    retryCount++;
    const retryDelay = 2000 * retryCount; // 2초, 4초, 6초
    setTimeout(() => {
      loadInterstitialAd();
    }, retryDelay);
  } else {
    retryCount = 0; // 재시도 카운트 리셋
  }
});

/**
 * 전면 광고 로드
 */
export const loadInterstitialAd = (): void => {
  if (!isAdLoading && !isAdLoaded) {
    isAdLoading = true;
    interstitial.load();
  }
};

/**
 * 전면 광고 표시
 * @returns Promise<boolean> - 광고 표시 성공 여부
 */
export const showInterstitialAd = async (): Promise<boolean> => {
  try {
    if (isAdLoaded) {
      await interstitial.show();
      return true;
    }
    // 광고가 로드되지 않았으면 로드 시작
    loadInterstitialAd();
    return false;
  } catch (_error) {
    return false;
  }
};

// 앱 시작 시 첫 광고 미리 로드
loadInterstitialAd();
