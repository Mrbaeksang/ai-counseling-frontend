import { create } from 'zustand';

// Toast 상태 관리 스토어
interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
  show: (
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning',
    duration?: number,
  ) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
  show: (message, type = 'info', duration = 3000) => {
    set({ visible: true, message, type, duration });
  },
  hide: () => {
    set({ visible: false });
  },
}));

// 전역 Toast 함수들
export const toast = {
  success: (message: string, duration?: number) => {
    useToast.getState().show(message, 'success', duration);
  },
  error: (message: string, duration?: number) => {
    useToast.getState().show(message, 'error', duration);
  },
  info: (message: string, duration?: number) => {
    useToast.getState().show(message, 'info', duration);
  },
  warning: (message: string, duration?: number) => {
    useToast.getState().show(message, 'warning', duration);
  },
};
