import React, { useEffect, useRef, useState } from 'react';
import styles from './chatmodal.module.scss';
import { ConversationRequest, ConversationResponse } from '../../model/modal';
const ChatModal = () => {
    const [conversation, setConversation] = useState<string[]>([]); // Store conversation messages
    const [currentMessage, setCurrentMessage] = useState<string>(''); // Store user input
    const [isConnected, setIsConnected] = useState<boolean>(false); // WebSocket connection state
    const socketRef = useRef<WebSocket | null>(null); // Store WebSocket connection
  
    // Initialize WebSocket connection
    useEffect(() => {
      socketRef.current = new WebSocket('wss://your-websocket-url');
  
      socketRef.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connection established');
        // Fetch the first question from INITIAL_CONVERSATION
        const initPayload: ConversationRequest = {
          user_id: '123', // Replace with dynamic user_id
          conversation_id: undefined,
        };
        socketRef.current?.send(JSON.stringify(initPayload));
      };
  
      socketRef.current.onmessage = (event) => {
        const data: ConversationResponse = JSON.parse(event.data);
        const message = data.conversation.message;
        setConversation((prev : any) => [...prev, message]); // Append response to conversation history
      };
  
      socketRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket connection closed');
      };
  
      return () => {
        socketRef.current?.close();
      };
    }, []);
  
    // Send user's message and fetch next question
    const handleSendMessage = () => {
      const payload: ConversationRequest = {
        user_id: '123', // Replace with dynamic user_id
        user_message: currentMessage,
        conversation_id: 'abc123', // Replace with dynamic conversation_id
        timestamp: new Date(),
      };
  
      socketRef.current?.send(JSON.stringify(payload));
      setConversation((prev) => [...prev, `You: ${currentMessage}`]); // Append user's message
      setCurrentMessage(''); // Reset input field
    };
  return (
    <div className={styles.chatModal}>
      <div className={styles.chatHeader}>
        <h2>Hi, I'm Globy 👋</h2>
        <p>We'll begin with some relevant questions, sounds good?</p>
      </div>
      <div className={styles.chatBody}>
        {conversation.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatModal
