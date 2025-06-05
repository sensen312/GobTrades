// src/components/KeyboardAvoidingViewWrapper.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ViewProps, ScrollViewProps, StyleSheet } from 'react-native';

interface KeyboardAvoidingViewWrapperProps {
    children: React.ReactNode;
    style?: ViewProps['style'];
    scrollViewProps?: ScrollViewProps;
    keyboardVerticalOffset?: number;
}

/** Wraps content to avoid keyboard overlap, especially for inputs. */
const KeyboardAvoidingViewWrapper: React.FC<KeyboardAvoidingViewWrapperProps> = ({
    children,
    style,
    scrollViewProps,
    keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0 // Adjusted for typical header height
}) => {
    // Reasoning: Addresses common keyboard overlap issues in React Native forms,
    // ensuring input fields remain visible and accessible when the keyboard is active.
    return (
        <KeyboardAvoidingView
            style={[stylesKAVWrapper.container, style]} // Renamed styles object
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled" // Ensures taps outside input dismiss keyboard
                contentContainerStyle={stylesKAVWrapper.scrollContent}
                showsVerticalScrollIndicator={false}
                {...scrollViewProps}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const stylesKAVWrapper = StyleSheet.create({ // Renamed styles object
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1, // Important to allow scrolling when content exceeds view
    },
});

export default KeyboardAvoidingViewWrapper;
