import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import useAuthStore from '@/store/authStore';

const CACHE_PREFIXES = [['favorites'] as const, ['sessions'] as const, ['userProfile'] as const];

export const useAuthCacheManager = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.userId ?? null);
  const isInitialized = useRef(false);
  const previousUserId = useRef<number | null>(null);

  useEffect(() => {
    if (!isInitialized.current) {
      previousUserId.current = userId;
      isInitialized.current = true;
      return;
    }

    if (previousUserId.current === userId) {
      return;
    }

    CACHE_PREFIXES.forEach((prefix) => {
      queryClient.removeQueries({ queryKey: prefix, exact: false });
    });

    previousUserId.current = userId;
  }, [queryClient, userId]);
};
