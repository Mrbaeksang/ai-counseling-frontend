import Constants from 'expo-constants';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

// 광고 단위 ID (프로덕션)
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
  retryCount = 0;
});

interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  isAdLoaded = false;
  retryCount = 0;
  loadInterstitialAd();
});

interstitial.addAdEventListener(AdEventType.ERROR, (_error) => {
  isAdLoaded = false;
  isAdLoading = false;

  if (retryCount < MAX_RETRIES) {
    retryCount++;
    const retryDelay = 2000 * retryCount;
    setTimeout(() => {
      loadInterstitialAd();
    }, retryDelay);
  } else {
    retryCount = 0;
  }
});

/**
 * 전면 광고 로드
 */
export const loadInterstitialAd = (): void => {
  try {
    if (!isAdLoading && !isAdLoaded) {
      isAdLoading = true;
      interstitial.load();
    }
  } catch (_error) {
    isAdLoading = false;
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

/**
 * AdMob SDK 초기화
 * 앱 시작 시 _layout.tsx에서 호출
 */
export const initializeAds = (): void => {
  setTimeout(() => {
    loadInterstitialAd();
  }, 1000);
};
