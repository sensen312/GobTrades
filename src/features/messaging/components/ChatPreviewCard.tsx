// src/features/messaging/components/ChatPreviewCard.tsx
import React from 'react';
import { HStack, VStack, Pressable } from '@gluestack-ui/themed';
import { formatDistanceToNowStrict } from 'date-fns';
import { ChatPreview } from '../../../types';
import ThemedText from '../../../components/ThemedText';
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import { useNavigation } from '@react-navigation/native';
import { MessagesScreenNavigationProp } from '../../../navigation/types';

interface ChatPreviewCardProps {
  chat: ChatPreview;
}

const ChatPreviewCard: React.FC<ChatPreviewCardProps> = ({ chat }) => {
  const navigation = useNavigation<MessagesScreenNavigationProp<'MessagingListScreen'>>();
  const timeAgo = formatDistanceToNowStrict(new Date(chat.lastMessageAt), { addSuffix: true });
  const isUnread = chat.unreadCount > 0;

  const handlePress = () => {
      navigation.navigate('ChatScreen', {
          chatId: chat._id,
          targetUserUuid: chat.otherParticipant.uuid,
          targetUserName: chat.otherParticipant.goblinName,
          targetUserPfpIdentifier: chat.otherParticipant.pfpIdentifier,
      });
  };

  return (
    <Pressable onPress={handlePress} py="$3" px="$4" bg={isUnread ? "$primary100" : "$backgroundCard"} borderBottomWidth={1} borderColor="$borderLight">
      <HStack space="md" alignItems="center">
        <UserPfpDisplay
            pfpIdentifier={chat.otherParticipant.pfpIdentifier}
            userName={chat.otherParticipant.goblinName}
            size="md"
         />
        <VStack flex={1}>
          <HStack justifyContent="space-between">
             <ThemedText bold isTruncated flex={1} color={isUnread ? "$primary700" : "$textPrimary"}>
                 {chat.otherParticipant.goblinName}
             </ThemedText>
             <ThemedText size="xs" color={isUnread ? "$primary700" : "$textSecondary"} ml="$2">
                 {timeAgo}
            </ThemedText>
          </HStack>
          <ThemedText size="sm" isTruncated numberOfLines={1} color={isUnread ? "$primary700" : "$textSecondary"}>
             {chat.lastMessagePreview || '...'}
          </ThemedText>
        </VStack>
      </HStack>
    </Pressable>
  );
};
export default ChatPreviewCard;
