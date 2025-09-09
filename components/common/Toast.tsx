import { Portal, Snackbar } from 'react-native-paper';
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

// Toast 컴포넌트
export default function Toast() {
  const { visible, message, type, duration, hide } = useToast();

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#10B981'; // green
      case 'error':
        return '#EF4444'; // red
      case 'warning':
        return '#F59E0B'; // yellow
      default:
        return '#6B46C1'; // purple (primary)
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert';
      default:
        return 'information';
    }
  };

  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={hide}
        duration={duration}
        style={{
          backgroundColor: getBackgroundColor(),
          marginBottom: 80, // 탭바 위에 표시
        }}
        icon={getIcon()}
      >
        {message}
      </Snackbar>
    </Portal>
  );
}
