import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Box } from '@gluestack-ui/themed'; // Import Box
import { useChatStore } from '../store/chatStore';
import ChatPreviewCard from '../components/ChatPreviewCard';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import EmptyState from '../../../components/EmptyState';
import ScreenContainer from '../../../components/ScreenContainer';

const MessagingListScreen: React.FC = () => {
    const { chats, fetchChats, chatsStatus, error } = useChatStore();

    useFocusEffect(useCallback(() => { if (chatsStatus === 'idle' || chatsStatus === 'error') { fetchChats(); } }, [fetchChats, chatsStatus]));
    const handleRefresh = useCallback(async () => { await fetchChats(); }, [fetchChats]);

    const renderContent = () => {
        if (chatsStatus === 'loading' && chats.length === 0) { return <LoadingIndicator text="Loading conversations..." overlay />; }
        if (chatsStatus === 'error' && chats.length === 0) { return <ErrorDisplay title="Error" message={error || 'Could not load conversations.'} />; }
        return (
            <FlatList
                data={chats} renderItem={({ item }) => <ChatPreviewCard chat={item} />} keyExtractor={(item) => item._id}
                onRefresh={handleRefresh} refreshing={chatsStatus === 'loading'}
                ListEmptyComponent={ chatsStatus === 'success' ? (<EmptyState message="You have no active conversations." title="No Chats Yet" iconName="message-text-outline"/>) : null }
                contentContainerStyle={{ flexGrow: 1 }}
            />
        );
     };

    return (
        // Use ScreenContainer, Box is needed for error banner
        <ScreenContainer scrollable={false} p={0}>
             {chatsStatus === 'error' && chats.length > 0 && <Box p="$4"><ErrorDisplay message={error} /></Box>}
             {renderContent()}
        </ScreenContainer>
    );
};

export default MessagingListScreen;
