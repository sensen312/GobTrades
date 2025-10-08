// src/features/messaging/screens/ChatScreen.tsx
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { FlatList, Platform, KeyboardAvoidingView } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useChatStore } from '../store/chatStore';
import { useChatConnection } from '../hooks/useChatConnection';
import MessageDisplay from '../components/MessageDisplay';
import ChatInputBar from '../components/ChatInputBar';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import { MessagesScreenRouteProp } from '../../../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import { showErrorToast } from '../../../utils/toast';
import { uploadChatMessageImageApi } from '../../../api/message';

type ChatScreenRouteProp = MessagesScreenRouteProp<'ChatScreen'>;

const ChatScreen: React.FC = () => {
    const route = useRoute<ChatScreenRouteProp>();
    const { chatId, listingId } = route.params;
    const flatListRef = useRef<FlatList>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { messages, messagesStatus, error, setActiveChatId, fetchMessages } = useChatStore(state => ({
        messages: state.messages[chatId ?? ''] || [],
        messagesStatus: state.messagesStatus[chatId ?? ''] || 'idle',
        error: state.error,
        setActiveChatId: state.setActiveChatId,
        fetchMessages: state.fetchMessages,
    }));
    
    const { sendMessage, connectionStatus } = useChatConnection();

    useFocusEffect(
        useCallback(() => {
            if (chatId) {
                setActiveChatId(chatId);
                if (messagesStatus === 'idle') {
                    fetchMessages(chatId);
                }
            }
            return () => setActiveChatId(null);
        }, [chatId, setActiveChatId, fetchMessages, messagesStatus])
    );

     useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    const handleSendText = (text: string) => {
        if (chatId) sendMessage(chatId, text.trim());
    };

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            await handleSendImage(result.assets[0].uri);
        }
    };

    const handleSendImage = async (imageUri: string) => {
        if (!chatId) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            const uriParts = imageUri.split('/');
            const fileName = uriParts.pop() || 'image.jpg';
            const fileType = fileName.split('.').pop();
            formData.append('imageFile', { uri: imageUri, name: fileName, type: `image/${fileType}` } as any);
            const uploadResponse = await uploadChatMessageImageApi(formData);
            sendMessage(chatId, undefined, uploadResponse.imageFilename);
        } catch (e: any) {
             showErrorToast(e.response?.data?.message || "Failed to send image.", "Upload Error");
        } finally {
            setIsUploading(false);
        }
    };

    if (messagesStatus === 'loading' && messages.length === 0) {
        return <LoadingIndicator text="Loading messages..." overlay />;
    }

    return (
        <Box flex={1} bg="$backgroundLight">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                {messagesStatus === 'error' && <ErrorDisplay message={error || "Failed to load messages."}/>}
                
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => <MessageDisplay message={item} />}
                    keyExtractor={(item) => item.localId || item._id}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, flexGrow: 1 }}
                />
                
                <ChatInputBar
                    onSendText={handleSendText}
                    onSendImage={handlePickImage}
                    connectionStatus={connectionStatus}
                />
                 {isUploading && <LoadingIndicator overlay text="Uploading image..." />}
            </KeyboardAvoidingView>
        </Box>
    );
};

export default ChatScreen;
