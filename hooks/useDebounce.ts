import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 중복 클릭 방지를 위한 디바운스 훅
 * @param callback 실행할 함수
 * @param delay 지연 시간 (기본값: 300ms)
 * @returns [디바운스된 함수, 로딩 상태]
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 300,
): [(...args: Parameters<T>) => void, boolean] {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // 이전 타이머 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsLoading(true);

      // 새 타이머 설정
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        setIsLoading(false);
      }, delay);
    },
    [callback, delay],
  );

  return [debouncedCallback, isLoading];
}

/**
 * 즉시 실행 후 일정 시간 동안 재실행 방지하는 쓰로틀 훅
 * @param callback 실행할 함수
 * @param delay 재실행 방지 시간 (기본값: 1000ms)
 * @returns [쓰로틀된 함수, 실행 가능 여부]
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 1000,
): [(...args: Parameters<T>) => void, boolean] {
  const [isThrottled, setIsThrottled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isThrottledRef = useRef(false);

  useEffect(() => {
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (isThrottledRef.current) return;

      callback(...args);
      isThrottledRef.current = true;
      setIsThrottled(true);

      timeoutRef.current = setTimeout(() => {
        isThrottledRef.current = false;
        setIsThrottled(false);
      }, delay);
    },
    [callback, delay],
  );

  return [throttledCallback, !isThrottled];
}

/**
 * 비동기 함수의 중복 실행을 방지하는 훅
 * @param asyncCallback 비동기 함수
 * @returns [래핑된 함수, 로딩 상태]
 */
export function useAsyncThrottle<T extends (...args: unknown[]) => Promise<unknown>>(
  asyncCallback: T,
): [(...args: Parameters<T>) => Promise<void>, boolean] {
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const throttledCallback = useCallback(
    async (...args: Parameters<T>) => {
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        await asyncCallback(...args);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [asyncCallback],
  );

  return [throttledCallback, isLoading];
}
