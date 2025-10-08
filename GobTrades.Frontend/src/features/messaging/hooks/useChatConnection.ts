import { useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useChatStore } from '../store/chatStore'; // Ensure correct path
import { useAuthStore } from '../../auth/store/authStore';
import { Message } from '../../../types';
import { API_BASE_URL } from '../../../api/index';
import uuid from 'react-native-uuid';
import { showErrorToast } from '../../../utils/toast';

// Construct Hub URL from API base URL, ensuring no double slashes
const HUB_URL = `${API_BASE_URL.replace(/\/$/, '')}/chathub`; // Remove potential trailing slash before adding /chathub

// Export the hook correctly
export const useChatConnection = () => {
    const connection = useRef<signalR.HubConnection | null>(null);
    // Destructure all needed actions from the store
    const { addMessage, setConnectionStatus, addOptimisticMessage, updateMessageStatus } = useChatStore();
    const { uuid: userUuid } = useAuthStore();

    // --- Start Connection Logic ---
    const startConnection = useCallback(async () => {
        // Prevent multiple connection attempts or connecting without user UUID
        if (!userUuid || connection.current?.state === signalR.HubConnectionState.Connected || connection.current?.state === signalR.HubConnectionState.Connecting) {
            console.log(`SignalR: Start connection skipped (UUID: ${!!userUuid}, State: ${connection.current?.state})`);
            return;
        }

        // Stop existing connection before starting new one if necessary
        if (connection.current) {
            console.log("SignalR: Stopping existing connection before reconnecting...");
            await connection.current.stop().catch(err => console.error("Error stopping previous SignalR connection:", err));
            connection.current = null;
        }

        console.log(`SignalR: Attempting to connect to ${HUB_URL} for user ${userUuid}`);
        setConnectionStatus('connecting');

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                // Pass user identifier (UUID) for backend identification/authentication
                 accessTokenFactory: () => userUuid || '' // Provide empty string if null just in case
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals
            .configureLogging(signalR.LogLevel.Information) // Log more info during dev
            .build();

        connection.current = newConnection;

        // --- Define Event Handlers ---
        newConnection.on('ReceiveMessage', (message: Message) => {
            console.log('SignalR: Message received:', message);
            addMessage(message); // Add confirmed message to Zustand store
        });

        newConnection.on('MessageSentConfirmation', (localId: string, serverMessage: Message) => {
             console.log(`SignalR: Confirmation received for localId ${localId}`);
             updateMessageStatus(localId, serverMessage.chatId, 'sent', serverMessage._id);
        });

        newConnection.on('MessageSendFailed', (localId: string, chatId: string, reason: string) => {
            console.error(`SignalR: Failed to send message ${localId}: ${reason}`);
            updateMessageStatus(localId, chatId, 'failed');
            showErrorToast(`Failed to send message: ${reason}`, "Send Error");
        });

        newConnection.onreconnecting((error) => {
            console.warn(`SignalR: Connection reconnecting... ${error ? `Error: ${error}` : ''}`);
            setConnectionStatus('connecting');
        });

        newConnection.onreconnected((connectionId) => {
            console.log(`SignalR: Connection reconnected with ID: ${connectionId}`);
            setConnectionStatus('connected');
            // Optional: Re-join groups if backend uses SignalR groups
            // connection.current?.invoke('JoinChatGroups').catch(err => console.error("Failed to rejoin groups:", err));
        });

        newConnection.onclose((error) => {
            console.error(`SignalR: Connection closed. ${error ? `Error: ${error}` : ''}`);
            // Only set error status if closed due to an error
            setConnectionStatus(error ? 'error' : 'disconnected');
            if (error) {
                showErrorToast(`Connection closed: ${error.message}`, "Connection Error");
            }
            // Clear the ref if connection closed, especially if due to an error,
            // to allow a clean reconnect attempt next time.
            connection.current = null;
        });

        // --- Start the Connection ---
        try {
            await newConnection.start();
            console.log('SignalR: Connected successfully.');
            setConnectionStatus('connected');
        } catch (err: any) {
            console.error('SignalR: Connection failed to start:', err);
            setConnectionStatus('error');
            showErrorToast(`Connection failed: ${err?.message || 'Unknown error'}`, "Connection Error");
            connection.current = null; // Clear ref on failed start
        }
    // Include ALL dependencies used within useCallback
    }, [userUuid, addMessage, setConnectionStatus, updateMessageStatus]);

    // --- Stop Connection Logic ---
    const stopConnection = useCallback(async () => {
        if (connection.current?.state === signalR.HubConnectionState.Connected) {
            console.log('SignalR: Stopping connection...');
            await connection.current.stop();
            console.log('SignalR: Connection stopped.');
        }
        // Always set status to disconnected on manual stop or if connection doesn't exist/fails
        setConnectionStatus('disconnected');
        connection.current = null; // Clear ref on stop
    }, [setConnectionStatus]); // setConnectionStatus is the dependency

    // --- Effect to Manage Connection Lifecycle based on Auth State ---
    useEffect(() => {
        if (userUuid) {
            startConnection(); // Attempt to connect if user UUID exists
        } else {
            stopConnection(); // Disconnect if user logs out (UUID becomes null)
        }

        // Cleanup function: Stop connection when the component unmounts or userUuid changes
        return () => {
            stopConnection();
        };
    // Dependencies: userUuid, startConnection, stopConnection
    }, [userUuid, startConnection, stopConnection]);


    // --- Function to Send a Message via SignalR ---
    const sendMessage = useCallback(async (chatId: string, text?: string, imageFilename?: string, offeredListingId?: string) => {
        if (connection.current?.state !== signalR.HubConnectionState.Connected) {
            showErrorToast("Cannot send message: Not connected.", "Connection Error");
            console.error("SignalR: Cannot send message, not connected.");
            // Optional: Attempt to reconnect?
            // startConnection();
            return;
        }
        // Prevent sending empty messages (neither text, image, nor offer)
        if (!text?.trim() && !imageFilename && !offeredListingId) {
             console.warn("SignalR: Attempted to send empty message.");
             return;
        }

        // Create optimistic message for immediate UI update
        const localId = uuid.v4() as string; // Generate unique local ID
        const optimisticMessage: Message = {
            _id: localId, // Use localId as temporary _id
            localId: localId,
            chatId: chatId,
            senderId: userUuid || 'unknown-sender', // Should always have userUuid here
            text: text?.trim(), // Trim text before sending
            imageFilename: imageFilename,
            isOffer: !!offeredListingId,
            offeredListingId: offeredListingId,
            createdAt: new Date().toISOString(), // Use current time
            status: 'sending', // Initial status
        };

        addOptimisticMessage(optimisticMessage); // Add to store optimistically

        try {
            // Invoke the correct Hub method on the backend
            // Ensure method name ('SendMessage') and payload structure match backend Hub definition
            await connection.current.invoke('SendMessage', {
                LocalId: localId, // Send localId for confirmation matching
                ChatId: chatId,
                Text: text?.trim(), // Send trimmed text
                ImageFilename: imageFilename,
                OfferedListingId: offeredListingId,
            });
            console.log(`SignalR: Message invoked (localId: ${localId})`);
            // Backend should send 'MessageSentConfirmation' or 'MessageSendFailed'
        } catch (err: any) {
            console.error(`SignalR: Error invoking SendMessage (localId: ${localId}):`, err);
            // Update message status to failed if invoke fails immediately
            updateMessageStatus(localId, chatId, 'failed');
            showErrorToast(`Send failed: ${err?.message || 'Unknown error'}`, "Send Error");
        }
    // Include ALL dependencies used within useCallback
    }, [connection.current, userUuid, addOptimisticMessage, updateMessageStatus]);

    // Return connection status from the store and the sendMessage function
    const connectionStatus = useChatStore(state => state.connectionStatus);
    return { sendMessage, connectionStatus };
};
