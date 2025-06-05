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

export interface Item { // This is ModelItem
  localId: string; 
  dbId?: string;    
  itemName: string;
  imageFilename: string;
  createdAt?: string; 
  updatedAt?: string; 
  // Added missing properties to align with StallItemLocal and ImageObject usage
  isNew?: boolean; 
  name?: string; // For client-side picker name if different from itemName
  uri?: string; // Display URI, especially for new local images
  type?: string; // Mime type
  originalFilename?: string; // Server filename for existing images
}

export interface Message {
  _id: string; 
  localId?: string; 
  chatId: string; 
  senderId: string; 
  text?: string; 
  createdAt: string; 
  status?: 'sending' | 'sent' | 'failed'; 
}

export interface ChatPreview {
  _id: string; 
  otherParticipant: {
    uuid: string;
    goblinName: string;
    pfpIdentifier: string;
  };
  lastMessagePreview?: string;
  lastMessageAt: string; 
  unreadCount: number;
}

export interface TradeRequest { // This is ModelTradeRequest
  _id: string;
  senderUuid: string;
  senderGoblinName: string;
  senderPfpIdentifier: string;
  recipientUuid: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ImageObject { // This is AppImageObject
  uri: string;
  type?: string;
  name?: string; // This is often the client-derived filename for new images
  localId: string;
  isNew: boolean;
  originalFilename?: string;
  dbId?: string;
}
