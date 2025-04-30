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
    keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0 // Default offset
}) => {
    return (
        <KeyboardAvoidingView
            style={[styles.container, style]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                {...scrollViewProps}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1, // Important to allow scrolling when content exceeds view
    },
});

export default KeyboardAvoidingViewWrapper;