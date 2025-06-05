// src/components/ScreenContainer.tsx
import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, Platform } from 'react-native';
import { Box, useToken } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

// Gluestack UI Prop Typing
type BoxPropsScreenContainer = ComponentProps<typeof Box>;

interface ScreenContainerProps extends BoxPropsScreenContainer {
  children: React.ReactNode;
  edges?: SafeAreaViewProps['edges']; // From react-native-safe-area-context
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps; // From react-native
}

/** Provides safe area padding and background color for screens. */
const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  edges = ['top', 'left', 'right'], // Default safe area edges
  scrollable = false,
  scrollViewProps,
  bg = '$backgroundLight', // Default background from theme
  flex = 1,
  p = '$4', // Default padding from theme
  ...boxProps // Other Box props
}) => {
  // Resolve background token for SafeAreaView as it's a plain RN View.
  // Gluestack components handle token resolution internally.
  const safeAreaBackgroundColor = useToken('colors', bg as any) || '#F5F0E0'; // Fallback color

  const content = (
    // Apply styling props directly to the Box component
    <Box bg={bg} flex={flex} p={p} {...boxProps}>
      {children}
    </Box>
  );

  return (
    <SafeAreaView style={[stylesScreenContainer.safeArea, { backgroundColor: safeAreaBackgroundColor }]} edges={edges}>
      {scrollable ? (
        <ScrollView
          style={stylesScreenContainer.scrollView}
          contentContainerStyle={stylesScreenContainer.scrollContent}
          keyboardShouldPersistTaps="handled" // Good for forms within scroll views
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          {content}
         </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const stylesScreenContainer = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 }, // Ensures scroll view can grow with content
});

export default ScreenContainer;
