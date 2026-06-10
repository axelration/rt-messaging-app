/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import ConversationItem from './conversationItem';
import { usei18n } from '@/hooks/language';
import { setConversation, getConversation } from '@/store/chat.store';

export default function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await apiFetch('/chat/conversations');
      setConversations(res);

      // decode user from token (simple way)
      const token = localStorage.getItem('accessToken');
      const payload = JSON.parse(atob(token!.split('.')[1]));
      setUserId(payload.sub);
    }
    load();
  }, []);

  function handleSelect(id: string) {
    setActiveId(id);
    setConversation(id);
  }

  return (
    <div className="w-1/3 border-r p-4 overflow-y-auto">
      {conversations.map((c: any) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          currentUserId={userId || ''}
          isActive={c.id === activeId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}