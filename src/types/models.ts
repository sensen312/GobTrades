// src/types/models.ts
export interface UserProfile {
  _id: string; 
  uuid: string; 
  goblinName: string;
  pfpIdentifier: string; 
  items: Item[]; 
  offeredItemTags: string[]; 
  wantsTags: string[]; 
  offeredItemsDescription: string; 
  wantedItemsDescription: string; 
  likeCount: number; 
  lastActive: string; 
  createdAt: string; 
  updatedAt: string; 
}

export interface Item {
  dbId?: string;
  localId: string;
  itemName: string;
  imageFilename: string;
  createdAt?: string;
  updatedAt?: string;
  isNew?: boolean;
  name?: string;
  uri?: string;
  type?: string;
  originalFilename?: string;
}

export interface Message {
  _id: string; 
  localId?: string; 
  chatId: string; 
  senderId: string; 
  text?: string; 
  createdAt: string; 
  status?: 'sending' | 'sent' | 'failed';
  imageFilename?: string;
  isOffer?: boolean;
  offeredListingId?: string;
}

export interface ChatPreview {
  _id: string; 
  participantUuids: string[];
  otherParticipant: {
    _id: string;
    uuid: string;
    goblinName: string;
    pfpIdentifier: string;
  };
  lastMessagePreview?: string;
  lastMessageAt: string; 
  unreadCount: number;
  associatedListingId?: string;
}

export interface TradeRequest {
  _id: string;
  senderUuid: string;
  senderGoblinName: string;
  senderPfpIdentifier: string;
  recipientUuid: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ImageObject {
  uri: string;
  type?: string;
  name?: string;
  localId: string;
  isNew: boolean;
  originalFilename?: string;
  dbId?: string;
}
