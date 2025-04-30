import React from 'react';
import { Box, Image, Pressable } from '@gluestack-ui/themed';
import { formatDistanceToNowStrict } from 'date-fns';
import { Message } from '../../../types';
import { IMAGE_API_PATH } from '../../../api/index';
import ThemedText from '../../../components/ThemedText';
import { useAuthStore } from '../../auth/store/authStore';
import type { ComponentProps } from 'react'; // Import ComponentProps

type ImageProps = ComponentProps<typeof Image>; // Get Image props type

interface MessageDisplayProps {
  message: Message;
  onImagePress?: (imageUrl: string) => void;
  onRetrySend?: (message: Message) => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, onImagePress, onRetrySend }) => {
  const currentUserUuid = useAuthStore((state) => state.uuid);
  const isMyMessage = message.senderId === currentUserUuid;
  const timeAgo = formatDistanceToNowStrict(new Date(message.createdAt), { addSuffix: true });
  const imageUrl = message.imageFilename ? `${IMAGE_API_PATH}${message.imageFilename}` : null;

  return (
    <Box
      alignSelf={isMyMessage ? 'flex-end' : 'flex-start'}
      bg={isMyMessage ? '$primary200' : '$backgroundCard'}
      maxWidth="80%"
      px="$3" py="$2"
      borderRadius="$lg"
      mb="$2"
      borderColor={message.status === 'failed' ? '$errorBase' : undefined}
      borderWidth={message.status === 'failed' ? 1 : 0}
      opacity={message.status === 'sending' ? 0.7 : 1}
    >
        {imageUrl && (
            <Pressable onPress={() => onImagePress?.(imageUrl)} disabled={!onImagePress} mb={message.text ? "$1.5" : 0}>
                 <Image
                    source={{ uri: imageUrl }}
                    alt="Chat image"
                    w={200}
                    h={200}
                    resizeMode="cover"
                    borderRadius={8} // Use number or theme token like '$md'
                />
            </Pressable>
        )}
        {message.text && (
            <ThemedText color={isMyMessage ? '$textPrimary' : '$textPrimary'} fontSize="$sm">
                {message.text}
            </ThemedText>
        )}
        <Box mt="$1" alignSelf="flex-end" flexDirection="row" alignItems="center">
             {message.status === 'failed' && (
                 <Pressable onPress={() => onRetrySend?.(message)} mr="$1.5">
                    <ThemedText size="xs" color="$errorBase">Failed - Retry?</ThemedText>
                 </Pressable>
            )}
             {message.status === 'sending' && (
                 <ThemedText size="xs" color="$textSecondary" mr="$1.5">Sending...</ThemedText>
            )}
            <ThemedText size="xs" color="$textSecondary">{timeAgo}</ThemedText>
        </Box>
    </Box>
  );
};
export default MessageDisplay;