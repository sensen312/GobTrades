// Defines core data structures matching backend MongoDB schema.

// User profile structure.
export interface UserProfile {
    _id: string;
    uuid: string;
    goblinName: string;
    pfpIdentifier: string;
    createdAt: string; // ISO 8601 Date string
    likedListingIds?: string[]; // Optional array of liked listing IDs
}

// Listing item structure.
export interface Listing {
    _id: string;
    userId: string;
    goblinName: string;
    itemName: string;
    description: string;
    imageFilenames: string[];
    primaryImageFilename?: string;
    tags: string[];
    wantsTags: string[];
    isActive: boolean; // Represents traded status (true = available)
    isDeleted?: boolean; // Optional for soft delete
    likeCount: number; // Number of likes
    createdAt: string; // ISO 8601 Date string
    updatedAt: string; // ISO 8601 Date string
}

// Chat preview structure for the messages list.
export interface ChatPreview {
    _id: string; // Chat ID
    participantIds: string[];
    // Details of the *other* participant in the chat.
    otherParticipant: { _id: string; goblinName: string; pfpIdentifier: string; };
    lastMessagePreview?: string; // Snippet of the last message
    lastMessageAt: string; // ISO 8601 Date string
    associatedListingId: string; // Listing context for the chat
    unreadCount: number; // Unread messages for the current user
}

// Individual message structure.
export interface Message {
    _id: string; // Message ID
    chatId: string;
    senderId: string; // User ID of the sender
    text?: string;
    imageFilename?: string;
    isOffer?: boolean; // Indicates if this message is a formal item offer
    offeredListingId?: string; // ID of the offered listing if isOffer is true
    createdAt: string; // ISO 8601 Date string
    // Client-side status for UI feedback (optional)
    status?: 'sending' | 'sent' | 'failed';
    localId?: string; // Temporary client-side ID
}

