/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import ConversationItem from './ConversationItem';
import CreateConversationModal from './CreateConversationModal';

type Props = {
  activeConversationId: string | null;
  onSelect: (conversation: any) => void;
};

export default function ChatSidebar({ activeConversationId, onSelect }: Props) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await apiFetch('/chat/conversations');
      setConversations(Array.isArray(res) ? res : (res?.data ?? []));

      const token = localStorage.getItem('accessToken');
      try {
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
        setUserId(payload?.sub ?? null);
      } catch {
        setUserId(null);
      }
    }
    load();
  }, []);

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const others = c.participants?.filter((p: any) => p.id !== userId) ?? [];
    const name = others.map((u: any) => u.name || u.email).join(', ');
    return name.toLowerCase().includes(search.toLowerCase());
  });

  function handleCreated(conv: any) {
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === conv.id);
      return exists ? prev : [conv, ...prev];
    });
    onSelect(conv);
    setShowCreate(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
        {/* TODO i18n */}
        {/* TODO Add dropdown for account details and logout */}
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Messages
        </h1>
        <Button
          size="sm"
          onClick={() => setShowCreate(true)}
          className="gap-1.5 text-xs h-8"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg
                       outline-none focus:ring-2 focus:ring-blue-500
                       text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-1.5 px-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-400">
            <Search className="w-5 h-5 opacity-50" />
            <p className="text-sm">
              {search ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filtered.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              currentUserId={userId || ''}
              isActive={c.id === activeConversationId}
              onSelect={() => onSelect(c)}
            />
          ))
        )}
      </div>

      {/* Create conversation modal */}
      {showCreate && (
        <CreateConversationModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
