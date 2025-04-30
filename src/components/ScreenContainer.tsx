import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, Platform } from 'react-native';
import { Box, useToken } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

type BoxProps = ComponentProps<typeof Box>;

interface ScreenContainerProps extends BoxProps {
  children: React.ReactNode;
  edges?: SafeAreaViewProps['edges'];
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
}

/** Provides safe area padding and background color for screens. */
const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  edges = ['top', 'left', 'right'],
  scrollable = false,
  scrollViewProps,
  bg = '$backgroundLight',
  flex = 1,
  p = '$4',
  ...boxProps
}) => {
  // Resolve background token for SafeAreaView
  const safeAreaBackgroundColor = useToken('colors', bg as any) || '#F5F5DC';

  const content = (
    // Apply styling props directly to the Box component
    <Box bg={bg} flex={flex} p={p} {...boxProps}>
      {children}
    </Box>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: safeAreaBackgroundColor }]} edges={edges}>
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});

export default ScreenContainer;