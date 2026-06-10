/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { usei18n } from '@/hooks/language';

interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  status?: string;
  sender?: { email: string; name?: string };
}

type Props = {
  conversationId: string;
};

function decodeCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('accessToken');
  try {
    return token ? JSON.parse(atob(token.split('.')[1])).sub : null;
  } catch {
    return null;
  }
}

function getInitials(email: string, name?: string) {
  const source = name || email;
  return source
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function MessageList({ conversationId }: Props) {
  const currentUserId = decodeCurrentUserId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Re-fetch messages and re-register socket listeners whenever conversation changes
  useEffect(() => {
    if (!conversationId) return;

    setMessages([]);

    async function load() {
      const res = await apiFetch(`/chat/conversations/${conversationId}/messages`);
      setMessages(Array.isArray(res) ? res : (res?.data ?? []));
    }

    load();

    const socket = getSocket();

    function onNewMessage(msg: Message) {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          // Avoid duplicates (optimistic update may already have it)
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    }

    function onTyping({ userId }: { userId: string }) {
      if (userId !== currentUserId) {
        setTypingUser(userId);
        setTimeout(() => setTypingUser(null), 2000);
      }
    }

    socket?.on('newMessage', onNewMessage);
    socket?.on('typing', onTyping);

    return () => {
      socket?.off('newMessage', onNewMessage);
      socket?.off('typing', onTyping);
    };
  }, [conversationId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-[#efeae2] dark:bg-gray-950">
      {messages.map((m) => {
        const isMe = m.senderId === currentUserId;
        const senderLabel = m.sender?.name || m.sender?.email || '';
        const initials = senderLabel ? getInitials(m.sender?.email ?? '', m.sender?.name) : '?';

        return (
          <div
            key={m.id}
            className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Other user avatar */}
            {!isMe && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-1">
                {initials}
              </div>
            )}

            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
              {/* Sender label for groups */}
              {!isMe && senderLabel && (
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-1 mb-0.5">
                  {senderLabel}
                </span>
              )}

              {/* Bubble */}
              <div
                className={`relative px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${isMe
                    ? 'bg-[#dcf8c6] dark:bg-green-800 text-gray-900 dark:text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                  }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>

                {/* Timestamp + status */}
                <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && (
                    <span className="text-[11px] leading-none">
                      {m.status === 'sending' ? '🕓' : m.status === 'sent' ? '✓' : '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingUser && (
        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0" />
          <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
            <div className="flex gap-1 items-center h-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
