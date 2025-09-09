import { Portal, Snackbar } from 'react-native-paper';
import { useToast } from '@/store/toastStore';

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
