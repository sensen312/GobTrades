// Configuration for react-native-toast-message appearance
import React from 'react';
import { BaseToastProps } from 'react-native-toast-message';
import { SuccessToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { config as themeConfig } from '../theme'; // Import your theme config
import { Platform } from 'react-native';

// Resolves theme tokens (basic example, assumes tokens are direct color strings)
// For complex tokens (like aliases), you might need useToken hook if used in a component context,
// or pre-resolve them if possible.
const resolveColor = (token: string): string => {
    // Basic resolution, assumes direct color mapping in themeConfig.tokens.colors
    // Extend this logic if using color modes or aliases extensively
    const colorKey = token.startsWith('$') ? token.substring(1) : token;
    return (themeConfig.tokens.colors as any)[colorKey] || token; // Fallback to token itself
};

const resolveFont = (token: string): string => {
     const fontKey = token.startsWith('$') ? token.substring(1) : token;
     return (themeConfig.tokens.fonts as any)[fontKey] || 'System'; // Fallback to system font
}

const resolveSize = (token: string): number => {
    const sizeKey = token.startsWith('$') ? token.substring(1) : token;
    return (themeConfig.tokens.fontSizes as any)[sizeKey] || 14; // Fallback size
}

const resolveRadius = (token: string): number => {
    const radiusKey = token.startsWith('$') ? token.substring(1) : token;
    return (themeConfig.tokens.radii as any)[radiusKey] || 4; // Fallback radius
}


export const toastConfig = {
  /** Success Toast */
  success: (props: BaseToastProps) => (
    <SuccessToast
      {...props}
      style={{
          borderLeftColor: resolveColor('$successBase'),
          width: '90%',
          marginTop: Platform.OS === 'ios' ? 50 : 20,
          backgroundColor: resolveColor('$successBg'),
          borderRadius: resolveRadius('$md'),
          borderWidth: 1,
          borderColor: resolveColor('$successBase'),
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: resolveSize('$sm'),
        fontFamily: resolveFont('$heading'),
        color: resolveColor('$successBase'),
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: resolveSize('$xs'),
        fontFamily: resolveFont('$body'),
        color: resolveColor('$textPrimary'),
      }}
    />
  ),

  /** Error Toast */
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
          borderLeftColor: resolveColor('$errorBase'),
          width: '90%',
          marginTop: Platform.OS === 'ios' ? 50 : 20,
          backgroundColor: resolveColor('$errorBg'),
          borderRadius: resolveRadius('$md'),
          borderWidth: 1,
          borderColor: resolveColor('$errorBase'),
       }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: resolveSize('$sm'),
        fontFamily: resolveFont('$heading'),
        color: resolveColor('$errorBase'),
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: resolveSize('$xs'),
        fontFamily: resolveFont('$body'),
        color: resolveColor('$textPrimary'),
      }}
    />
  ),

   /** Info Toast */
  info: (props: BaseToastProps) => (
     <InfoToast
      {...props}
      style={{
          borderLeftColor: resolveColor('$infoBase'),
          width: '90%',
          marginTop: Platform.OS === 'ios' ? 50 : 20,
          backgroundColor: resolveColor('$infoBg'),
          borderRadius: resolveRadius('$md'),
          borderWidth: 1,
          borderColor: resolveColor('$infoBase'),
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
       text1Style={{
        fontSize: resolveSize('$sm'),
        fontFamily: resolveFont('$heading'),
        color: resolveColor('$infoBase'),
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: resolveSize('$xs'),
        fontFamily: resolveFont('$body'),
        color: resolveColor('$textPrimary'),
      }}
    />
  ),
};