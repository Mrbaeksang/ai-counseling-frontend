import { BlurView } from 'expo-blur';
import React, { type ReactNode } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';

interface BlurredDialogProps {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export const BlurredDialog = React.memo(
  ({ visible, onDismiss, children, intensity = 80, tint = 'dark' }: BlurredDialogProps) => {
    // iOS는 BlurView, Android는 반투명 배경
    const renderBackground = () => {
      if (Platform.OS === 'ios') {
        return (
          <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFillObject}>
            <View style={styles.backdrop} />
          </BlurView>
        );
      }
      return <View style={styles.androidBackdrop} />;
    };

    return (
      <Portal>
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={onDismiss}
          statusBarTranslucent
        >
          <View style={styles.container}>
            {renderBackground()}
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
              {children}
            </Dialog>
          </View>
        </Modal>
      </Portal>
    );
  },
);

BlurredDialog.displayName = 'BlurredDialog';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  androidBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  dialog: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
});
