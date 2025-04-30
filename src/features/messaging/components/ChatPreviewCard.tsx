import React from 'react';
import { HStack, VStack, Pressable } from '@gluestack-ui/themed';
import { formatDistanceToNowStrict } from 'date-fns';
import { ChatPreview } from '../../../types';
import ThemedText from '../../../components/ThemedText';
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { MessagesScreenProps } from '../../../navigation/types'; // Import screen props type

interface ChatPreviewCardProps {
  chat: ChatPreview;
  // Remove onPress prop, handle navigation internally
}

const ChatPreviewCard: React.FC<ChatPreviewCardProps> = ({ chat }) => {
  const navigation = useNavigation<MessagesScreenProps<'MessagingList'>['navigation']>(); // Typed navigation
  const timeAgo = formatDistanceToNowStrict(new Date(chat.lastMessageAt), { addSuffix: true });
  const isUnread = chat.unreadCount > 0;

  const handlePress = () => {
      // Navigate to the Chat screen, passing necessary parameters
      navigation.navigate('Chat', {
          chatId: chat._id, // Pass existing chat ID
          listingId: chat.associatedListingId,
          otherUserId: chat.otherParticipant._id, // Pass the other user's ID
          otherUserName: chat.otherParticipant.goblinName, // Pass name for header title
          otherUserPfpId: chat.otherParticipant.pfpIdentifier, // Pass PFP if needed
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
        {/* Optional: Display unread count badge */}
      </HStack>
    </Pressable>
  );
};
export default ChatPreviewCard;
