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

// 광고 이벤트 리스너
interstitial.addAdEventListener(AdEventType.LOADED, () => {
  isAdLoaded = true;
  isAdLoading = false;
});

interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  isAdLoaded = false;
  // 광고가 닫히면 다음 광고를 미리 로드
  loadInterstitialAd();
});

interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
  console.error('광고 로드 실패:', error);
  isAdLoaded = false;
  isAdLoading = false;
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
  } catch (error) {
    console.error('광고 표시 실패:', error);
    return false;
  }
};

// 앱 시작 시 첫 광고 미리 로드
loadInterstitialAd();
