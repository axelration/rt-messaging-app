'use client';

import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatWindow() {
  return (
    <div className="flex flex-col flex-1">
      <MessageList />
      <MessageInput />
    </div>
  );
}