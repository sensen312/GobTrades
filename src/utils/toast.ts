import Toast from 'react-native-toast-message';

/** Shows a success toast message. */
export function showSuccessToast(message: string, title?: string) {
    Toast.show({
      type: 'success', // Matches type in toastConfig
      text1: title, // Optional title
      text2: message, // Main message content
      position: 'top',
      visibilityTime: 3000, // Duration in milliseconds (3 seconds)
      autoHide: true,
      topOffset: 60, // Adjust offset from top if needed
    });
}

/** Shows an error toast message. */
export function showErrorToast(message: string, title?: string) {
    Toast.show({
      type: 'error', // Matches type in toastConfig
      text1: title || 'Heck!', // Default title if none provided
      text2: message,
      position: 'top',
      visibilityTime: 4000, // Longer duration for errors (4 seconds)
      autoHide: true,
      topOffset: 60,
    });
}

/** Shows an informational toast message. */
export function showInfoToast(message: string, title?: string) {
    Toast.show({
      type: 'info', // Matches type in toastConfig
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
    });
}
