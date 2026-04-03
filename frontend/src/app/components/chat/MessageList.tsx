/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { usei18n } from "@/app/hooks/language";
import { getSocket } from "@/app/lib/socket";
import { getConversation } from "@/app/store/chat.store";
import { useEffect, useState } from "react";

type Message = {
  id: string;
  conversationId: string;
  content: string;
  createdAt: string;
};

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  // decode user ID from JWT token
  const token = localStorage.getItem("accessToken");
  const payload = JSON.parse(atob(token!.split(".")[1]));
  setUserId(payload.sub);

  useEffect(() => {
    const convId = getConversation();
    if (!convId) return;

    async function load() {
      const res = await fetch(`/chat/conversations/${convId}/messages`);
      console.log('Loaded messages', await res.json());
      setMessages(await res.json());
    }

    load();

    const socket = getSocket();
    socket?.on('newMessage', (msg: Message) => {
      if (msg.conversationId === convId) {
        setMessages((prev) => [...prev, msg]);
      }

      return () => socket?.off('newMessage');
    })

    socket?.on('typing', ({ userId }) => {
      setTypingUser(userId);
      setTimeout(() => setTypingUser(null), 1500);

      return () => socket?.off('typing');
  });
  }, []);

  return (
    <div>
      {messages.map((m: any) => {
        const isMe = m.senderId === userId;

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
              {typingUser && (
                <div className="text-sm text-gray-500">
                  {t.someone_is_typing}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}