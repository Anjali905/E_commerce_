export interface ConversationRequest {
    user_id: string;
    user_message?: string;
    conversation_id?: string;
    timestamp?: Date;
  }
  
  export interface ConversationResponse {
    error?: string;
    conversation: Conversation;
    timestamp: Date;
  }
  
  export interface Conversation {
    user_id: string;
    role: 'bot' | 'user';
    message: string | object;
    conversation_id: string;
    conversation_type: 'INITIAL_CONVERSATION' | 'CATEGORY_CONVERSATION' | 'METADATA_CONVERSATION';
    state: 'ACTIVE' | 'FINISHED';
  }