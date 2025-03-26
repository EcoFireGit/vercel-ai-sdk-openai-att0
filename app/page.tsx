'use client';

import { useChat, useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function Chat() {
  const [chatMessage, setChatMessage] = useState('');

  // Use useChat for the main chat functionality
  const { messages, input, setInput, handleSubmit, handleInputChange } = useChat();

  // Use useCompletion for auto-completion
  const { complete, completion } = useCompletion({
    api: '/api/completion',
  });

  const generateCompletion = useDebouncedCallback((e) => {
    complete(chatMessage);
  }, 500);

  const handleChatInputChange = (e) => {
    setChatMessage(e.target.value);
    handleInputChange(e);
  };

  const handleChatSubmit = (e) => {
    handleSubmit(e);
    setChatMessage('');
  };

  return (
    <div className="chat">
      <h1>Welcome to the AI Chatbot</h1>
      <div className="message_content">
        {messages.map((m) => (
          <div key={m.id}>
            <span>{m.role === 'user' ? '👤' : '🤖'}: </span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="text_area">
        <form onSubmit={(e) => handleChatSubmit(e)}>
          <input
            value={input}
            placeholder="Say something..."
            onChange={(e) => handleChatInputChange(e)}
          />
        </form>
        <button onClick={generateCompletion}>Generate completion</button>
        <div>{completion}</div>
      </div>
    </div>
  );
}
