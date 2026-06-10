/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { getConversation } from '@/store/chat.store';
import { usei18n } from '@/hooks/language';

interface Message {
  id: string;
  content: string;
  sender?: { email: string };
  conversationId: string;
}

export default function MessageList() {
  const { t } = usei18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUserId = JSON.parse(
    atob(localStorage.getItem('accessToken')!.split('.')[1])
  ).sub;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // typing indicator
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    const convId = getConversation();
    if (!convId) return;

    async function load() {
      const res = await apiFetch(`/chat/conversations/${convId}/messages`);
      setMessages(res.data);
    }

    load();

    const socket = getSocket();

    socket?.on('newMessage', (msg) => {
      if (msg.conversationId === convId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket?.on('typing', ({ userId }) => {
      setTypingUser(userId);

      setTimeout(() => setTypingUser(null), 1500);
    });

    return () => {
      socket?.off('newMessage');
      socket?.off('typing');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((m: any) => {
        const isMe = m.senderId === currentUserId;

        return (
          <div
            key={m.id}
            className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded max-w-xs
                ${isMe
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                }
              `}
            >
              {!isMe && (
                <div className="text-xs font-bold mb-1">
                  {m.sender?.email}
                </div>
              )}
              {m.content}
            </div>
            {/* Typing indicator if other user is typing */}
            {typingUser && (
              <div className="text-sm text-gray-500 ml-2 font-italic">
                {t.typing}...
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}