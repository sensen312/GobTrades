// src/utils/toast.ts
import Toast from 'react-native-toast-message';

export function showSuccessToast(message: string, title?: string) {
    Toast.show({
      type: 'success', text1: title, text2: message, position: 'top',
      visibilityTime: 3000, autoHide: true, topOffset: 60,
    });
}
export function showErrorToast(message: string, title?: string) {
    Toast.show({
      type: 'error', text1: title || 'Heck!', text2: message, position: 'top',
      visibilityTime: 4000, autoHide: true, topOffset: 60,
    });
}
export function showInfoToast(message: string, title?: string) {
    Toast.show({
      type: 'info', text1: title, text2: message, position: 'top',
      visibilityTime: 3000, autoHide: true, topOffset: 60,
    });
}
