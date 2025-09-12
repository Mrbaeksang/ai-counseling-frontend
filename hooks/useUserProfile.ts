import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { deleteAccount, getMyProfile, updateNickname } from '@/services/users';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/store/toastStore';

export const useUserProfile = () => {
  const queryClient = useQueryClient();
  const { show: showToast } = useToast();
  const { updateUser, logout } = useAuthStore();

  // 프로필 조회
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 닉네임 변경
  const nicknameMutation = useMutation({
    mutationFn: updateNickname,
    onMutate: async (newNickname: string) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData(['userProfile']);

      queryClient.setQueryData(['userProfile'], (old: unknown) => ({
        ...(old as Record<string, unknown>),
        nickname: newNickname,
      }));

      // Zustand store도 업데이트
      updateUser({ nickname: newNickname });

      return { previousProfile };
    },
    onError: (_error: unknown, _variables, context) => {
      // 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile'], context.previousProfile);
      }
      showToast('닉네임 변경에 실패했습니다', 'error');
    },
    onSuccess: () => {
      showToast('닉네임이 변경되었습니다', 'success');
    },
  });

  // 회원 탈퇴
  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      showToast('회원 탈퇴가 완료되었습니다', 'success');
      await logout();
      router.replace('/(auth)/login');
    },
    onError: () => {
      showToast('회원 탈퇴에 실패했습니다', 'error');
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
