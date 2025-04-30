import Toast from 'react-native-toast-message';

 /** Shows a success toast message. */
 export function showSuccessToast(message: string, title?: string) {
     Toast.show({
       type: 'success',
       text1: title,
       text2: message,
       position: 'top',
       visibilityTime: 3000,
       autoHide: true,
       topOffset: 60,
     });
 }

 /** Shows an error toast message. */
 export function showErrorToast(message: string, title?: string) {
     Toast.show({
       type: 'error',
       text1: title || 'Heck!',
       text2: message,
       position: 'top',
       visibilityTime: 4000,
       autoHide: true,
       topOffset: 60,
     });
 }

 /** Shows an informational toast message. */
 export function showInfoToast(message: string, title?: string) {
     Toast.show({
       type: 'info',
       text1: title,
       text2: message,
       position: 'top',
       visibilityTime: 3000,
       autoHide: true,
       topOffset: 60,
     });
 }
 