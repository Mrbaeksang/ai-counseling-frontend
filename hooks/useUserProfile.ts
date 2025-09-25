import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { deleteAccount, getMyProfile, updateNickname } from '@/services/users';
import type { UserProfileResponse } from '@/services/users/types';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/store/toastStore';

export const useUserProfile = () => {
  const queryClient = useQueryClient();
  const { show: showToast } = useToast();
  const { updateUser, logout, user } = useAuthStore();

  const userIdForKey = user?.userId ?? 'guest';

  React.useEffect(() => {
    if (!user) {
      queryClient.removeQueries({ queryKey: ['userProfile'] });
    }
  }, [user, queryClient]);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', userIdForKey],
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!user,
    retry: false,
  });

  React.useEffect(() => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        logout().then(() => {
          showToast('세션이 만료되었습니다. 다시 로그인해주세요.', 'info');
        });
      }
    }
  }, [error, logout, showToast]);

  const nicknameMutation = useMutation({
    mutationFn: updateNickname,
    onMutate: async (newNickname: string) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', userIdForKey] });
      const previousProfile = queryClient.getQueryData<UserProfileResponse>([
        'userProfile',
        userIdForKey,
      ]);

      queryClient.setQueryData(
        ['userProfile', userIdForKey],
        (old: UserProfileResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            nickname: newNickname,
          };
        },
      );

      updateUser({ nickname: newNickname });

      return { previousProfile };
    },
    onError: (_error: unknown, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile', userIdForKey], context.previousProfile);
      }
      showToast('닉네임 변경에 실패했습니다', 'error');
    },
    onSuccess: () => {
      showToast('닉네임이 변경되었습니다', 'success');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      showToast('계정이 삭제되었습니다', 'success');
      await logout();
      queryClient.removeQueries({ queryKey: ['userProfile'] });
      router.replace('/(auth)/login');
    },
    onError: () => {
      showToast('계정 삭제에 실패했습니다', 'error');
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateNickname: nicknameMutation.mutate,
    isUpdatingNickname: nicknameMutation.isPending,
    deleteAccount: deleteMutation.mutate,
    isDeletingAccount: deleteMutation.isPending,
  };
};
