import React, { useState } from 'react';
import { Box, HStack, Input, InputField } from '@gluestack-ui/themed';
import IconButton from '../../../components/IconButton';
import { ConnectionStatus } from '../store/chatStore'; // Import exported type

interface ChatInputBarProps {
    onSendText: (text: string) => void;
    onSendImage: () => void;
    onSendOffer?: () => void;
    connectionStatus: ConnectionStatus;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendText, onSendImage, onSendOffer, connectionStatus }) => {
    const [text, setText] = useState('');
    const isConnected = connectionStatus === 'connected';
    // Disable input/buttons if not connected or during connection attempts
    const isDisabled = !isConnected;

    const handleSend = () => { if (text.trim().length > 0) { onSendText(text.trim()); setText(''); } };

    return (
        <Box bg="$backgroundCard" borderTopWidth={1} borderColor="$borderLight" p="$2" >
            <HStack space="sm" alignItems="center">
                <IconButton iconName="image-plus" iconSize={28} iconColor={isDisabled ? "$textDisabled" : "$primary500"} onPress={onSendImage} aria-label="Attach image" disabled={isDisabled} />
                {onSendOffer && (<IconButton iconName="gift-outline" iconSize={28} iconColor={isDisabled ? "$textDisabled" : "$secondary500"} onPress={onSendOffer} aria-label="Make offer" disabled={isDisabled} />)}
                {/* Pass isDisabled to the parent Input component */}
                <Input variant="outline" size="md" flex={1} isDisabled={isDisabled}>
                    <InputField
                        placeholder={isConnected ? "Type your message..." : "Connecting..."}
                        value={text}
                        onChangeText={setText}
                        blurOnSubmit={false}
                        multiline
                        maxHeight={100}
                        // InputField itself might not directly support isDisabled, Input handles it
                    />
                </Input>
                <IconButton iconName="send" iconSize={28} iconColor={isDisabled || text.trim().length === 0 ? "$textDisabled" : "$primary500"} onPress={handleSend} aria-label="Send message" disabled={isDisabled || text.trim().length === 0} />
            </HStack>
        </Box>
    );
};

export default ChatInputBar;
