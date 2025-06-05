// src/config/toastConfig.tsx
import React from 'react';
import { BaseToastProps } from 'react-native-toast-message';
import { SuccessToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { config as themeConfigToast } from '../theme'; // Aliased
import { Platform } from 'react-native';

// Reasoning: Provides a centralized configuration for toast notifications,
// ensuring they match the app's visual style for consistency.

// Helper function to resolve color tokens from the theme.
// Gluestack's useToken hook cannot be used outside React components, so direct access is needed here.
const resolveColorToast = (token: string): string => {
    const colorKey = token.startsWith('$') ? token.substring(1) : token;
    // Accessing colors directly from the pre-defined theme config object.
    return (themeConfigToast.tokens.colors as Record<string, string>)[colorKey] || token;
};

// Helper function to resolve font tokens.
const resolveFontToast = (token: string): string => {
     const fontKey = token.startsWith('$') ? token.substring(1) : token;
     return (themeConfigToast.tokens.fonts as Record<string, string>)[fontKey] || 'System';
};

// Helper function to resolve font size tokens.
const resolveSizeToast = (token: string): number => {
    const sizeKey = token.startsWith('$') ? token.substring(1) : token;
    return (themeConfigToast.tokens.fontSizes as Record<string, number>)[sizeKey] || 14;
};

// Helper function to resolve radii tokens.
const resolveRadiusToast = (token: string): number => {
    const radiusKey = token.startsWith('$') ? token.substring(1) : token;
    return (themeConfigToast.tokens.radii as Record<string, number>)[radiusKey] || 4;
};


export const toastConfig = {
  success: (props: BaseToastProps) => (
    <SuccessToast
      {...props}
      style={{
          borderLeftColor: resolveColorToast('$successBase'), width: '90%',
          marginTop: Platform.OS === 'ios' ? 50 : 20, backgroundColor: resolveColorToast('$successBg'),
          borderRadius: resolveRadiusToast('$md'), borderWidth: 1, borderColor: resolveColorToast('$successBase'),
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: resolveSizeToast('$sm'), fontFamily: resolveFontToast('$heading'),
        color: resolveColorToast('$successBase'), fontWeight: '600',
      }}
      text2Style={{
        fontSize: resolveSizeToast('$xs'), fontFamily: resolveFontToast('$body'),
        color: resolveColorToast('$textPrimary'),
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
          borderLeftColor: resolveColorToast('$errorBase'), width: '90%',
          marginTop: Platform.OS === 'ios' ? 50 : 20, backgroundColor: resolveColorToast('$errorBg'),
          borderRadius: resolveRadiusToast('$md'), borderWidth: 1, borderColor: resolveColorToast('$errorBase'),
       }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: resolveSizeToast('$sm'), fontFamily: resolveFontToast('$heading'),
        color: resolveColorToast('$errorBase'), fontWeight: '600',
      }}
      text2Style={{
        fontSize: resolveSizeToast('$xs'), fontFamily: resolveFontToast('$body'),
        color: resolveColorToast('$textPrimary'),
      }}
    />
  ),
  info: (props: BaseToastProps) => (
     <InfoToast
      {...props}
      style={{
          borderLeftColor: resolveColorToast('$infoBase'), width: '90%',
          marginTop: Platform.OS === 'ios' ? 50 : 20, backgroundColor: resolveColorToast('$infoBg'),
          borderRadius: resolveRadiusToast('$md'), borderWidth: 1, borderColor: resolveColorToast('$infoBase'),
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
       text1Style={{
        fontSize: resolveSizeToast('$sm'), fontFamily: resolveFontToast('$heading'),
        color: resolveColorToast('$infoBase'), fontWeight: '600',
      }}
      text2Style={{
        fontSize: resolveSizeToast('$xs'), fontFamily: resolveFontToast('$body'),
        color: resolveColorToast('$textPrimary'),
      }}
    />
  ),
};
