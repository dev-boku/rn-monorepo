import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import { ThemedText, ThemedView } from '@/src/shared/ui/components';
import { colors } from '@/src/shared/ui/theme';

const { width } = Dimensions.get('window');

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type CustomAlertProps = {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  onDismiss?: () => void;
};

export default function CustomAlert({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}: CustomAlertProps) {
  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const getButtonStyle = (style: AlertButton['style']) => {
    switch (style) {
      case 'cancel':
        return {
          backgroundColor: colors.textMuted,
          color: '#FFFFFF',
        };
      case 'destructive':
        return {
          backgroundColor: colors.error,
          color: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: colors.primary,
          color: '#FFFFFF',
        };
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />

        <View style={styles.alertContainer}>
          <ThemedView style={styles.alertContent}>
            {/* 제목 */}
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>

            {/* 메시지 */}
            {message && (
              <ScrollView
                style={styles.messageContainer}
                showsVerticalScrollIndicator={false}
              >
                <ThemedText style={styles.message}>{message}</ThemedText>
              </ScrollView>
            )}

            {/* 버튼들 */}
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => {
                const buttonStyle = getButtonStyle(button.style);

                return (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.button,
                      { backgroundColor: buttonStyle.backgroundColor },
                      pressed && styles.buttonPressed,
                      buttons.length === 1 && styles.singleButton,
                      buttons.length === 2 && [
                        index === 0 ? styles.leftButton : styles.rightButton,
                      ],
                    ]}
                    onPress={() => handleButtonPress(button)}
                  >
                    <ThemedText
                      style={[styles.buttonText, { color: buttonStyle.color }]}
                    >
                      {button.text}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </ThemedView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 320,
    maxHeight: '80%',
  },
  alertContent: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.text,
  },
  messageContainer: {
    maxHeight: 200,
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: 'Pretendard-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  singleButton: {
    flex: 1,
  },
  leftButton: {
    marginRight: 6,
  },
  rightButton: {
    marginLeft: 6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
  },
});
