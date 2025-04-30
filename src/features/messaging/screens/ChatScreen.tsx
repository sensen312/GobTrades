import React, { useEffect, useRef, useCallback, useState } from 'react';
import { FlatList, Platform, KeyboardAvoidingView, AppState } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { useRoute, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useChatStore } from '../store/chatStore';
import { useChatConnection } from '../hooks/useChatConnection';
import MessageDisplay from '../components/MessageDisplay';
import ChatInputBar from '../components/ChatInputBar';
import AttachedItemPreview from '../components/AttachedItemPreview';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import { MessagesScreenProps } from '../../../navigation/types';
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import { uploadChatMessageImageApi } from '../../../api/message'; // API for uploading image
import { showErrorToast } from '../../../utils/toast';

type Props = MessagesScreenProps<'Chat'>;
type RouteProps = Props['route'];

const ChatScreen: React.FC = () => {
    const route = useRoute<RouteProps>();
    const { chatId, listingId } = route.params; // Get params
    const flatListRef = useRef<FlatList>(null);
    const [isUploading, setIsUploading] = useState(false); // State for image upload loading

    // Zustand state selectors
    const {
        messages, messagesStatus, error, setActiveChatId, fetchMessages, activeChatId
    } = useChatStore(state => ({
        messages: state.messages[chatId ?? ''] || [],
        messagesStatus: state.messagesStatus[chatId ?? ''] || 'idle',
        error: state.error,
        setActiveChatId: state.setActiveChatId,
        fetchMessages: state.fetchMessages,
        activeChatId: state.activeChatId,
    }));

    // SignalR connection hook
    const { sendMessage, connectionStatus } = useChatConnection();

    // --- Effects ---

    // Set active chat ID when screen focuses, clear when it blurs
    useFocusEffect(
        useCallback(() => {
            console.log(`ChatScreen focused: Setting active chat ID to ${chatId}`);
            setActiveChatId(chatId ?? null);
            // Fetch messages if not already loaded/loading
            if (chatId && messagesStatus === 'idle') {
                fetchMessages(chatId);
            }
            return () => {
                console.log(`ChatScreen blurred: Clearing active chat ID ${chatId}`);
                // Only clear if the currently active chat is THIS chat
                // This prevents accidentally clearing if navigating quickly between chats
                if (useChatStore.getState().activeChatId === chatId) {
                     setActiveChatId(null);
                }
            };
        }, [chatId, setActiveChatId, fetchMessages, messagesStatus])
    );

     // Scroll to bottom when new messages are added or keyboard opens
     // This needs refinement, especially with KeyboardAvoidingView
     useEffect(() => {
        if (messages.length > 0) {
            // Delay slightly to allow layout adjustments
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
        }
    }, [messages.length]); // Trigger on message count change


    // --- Handlers ---

    const handleSendText = (text: string) => {
        if (chatId) {
            sendMessage(chatId, text.trim());
        } else {
            console.warn("Cannot send message, chatId is missing");
            showErrorToast("Cannot send message: Chat ID missing.", "Send Error");
        }
    };

    const handlePickImage = async () => {
        // Request permissions if needed (though library usually handles it)
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== 'granted') {
        //     showErrorToast("Permission needed to access photos.", "Permission Denied");
        //     return;
        // }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            handleSendImage(imageUri); // Pass URI to upload/send function
        }
    };

    const handleSendImage = async (imageUri: string) => {
        if (!chatId) {
             showErrorToast("Cannot send image: Chat ID missing.", "Send Error");
             return;
        }
        setIsUploading(true);
        try {
            // Create FormData for upload
            const formData = new FormData();
            const uriParts = imageUri.split('/');
            const fileName = uriParts[uriParts.length - 1];
            let fileType = fileName.split('.').pop();
            if (fileType === 'jpg') fileType = 'jpeg';

            formData.append('imageFile', { // Key must match backend expectation
                uri: imageUri,
                name: fileName,
                type: `image/${fileType}`,
            } as any);

            // Call API to upload image
            const uploadResponse = await uploadChatMessageImageApi(formData);
            const imageFilename = uploadResponse.imageFilename;

            // Send message via SignalR with the returned filename
            sendMessage(chatId, undefined, imageFilename);

        } catch (error: any) {
             console.error("Failed to upload/send image:", error);
             showErrorToast(error.response?.data?.message || "Failed to send image.", "Upload Error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSendOffer = (offeredListingId: string) => {
         if (chatId) {
            // Assuming sendMessage handles offers via offeredListingId param
            sendMessage(chatId, undefined, undefined, offeredListingId);
        } else {
             console.warn("Cannot send offer, chatId is missing");
             showErrorToast("Cannot send offer: Chat ID missing.", "Send Error");
        }
    };

    // --- Rendering ---

    if (messagesStatus === 'loading' && messages.length === 0) {
        return <LoadingIndicator text="Loading messages..." overlay />;
    }

    return (
        <Box flex={1} bg="$backgroundLight">
            {/* Use KeyboardAvoidingView to push input bar up */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                // Adjust offset if header is present or for custom needs
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {/* Display error if fetching failed */}
                {messagesStatus === 'error' && <ErrorDisplay message={error || "Failed to load messages."}/>}

                {/* Context Item Preview */}
                {listingId && <AttachedItemPreview listingId={listingId} />}

                {/* Message List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => <MessageDisplay message={item} />}
                    keyExtractor={(item) => item._id || item.localId || Math.random().toString()} // Use localId as fallback key
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10, flexGrow: 1 }} // flexGrow helps with scrolling
                    // Optimization: remove inverted if causing issues with KeyboardAvoidingView
                    // inverted
                    // style={Platform.OS === 'android' ? { transform: [{ scaleY: -1 }] } : {}} // Invert scroll for Android if using inverted
                    // renderItem={({ item }) => (
                    //     <Box style={Platform.OS === 'android' ? { transform: [{ scaleY: -1 }] } : {}}>
                    //         <MessageDisplay message={item} />
                    //     </Box>
                    // )}
                />

                {/* Input Bar */}
                <ChatInputBar
                    onSendText={handleSendText}
                    onSendImage={handlePickImage} // Trigger picker
                    // onSendOffer={handleSendOffer} // Add offer button trigger if needed
                    connectionStatus={connectionStatus}
                />
                 {/* Show overlay loading indicator during image upload */}
                {isUploading && <LoadingIndicator overlay text="Uploading image..." bg="rgba(0,0,0,0.3)" />}
            </KeyboardAvoidingView>
        </Box>
    );
};

export default ChatScreen;