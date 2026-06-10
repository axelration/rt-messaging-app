/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Info, Menu, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatDetailModal from './ChatDetailModal';

type Props = {
  conversation: any;
  onMenuClick: () => void;
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

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function ChatWindow({ conversation, onMenuClick }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const currentUserId = decodeCurrentUserId();

  const others = (conversation.participants ?? []).filter(
    (p: any) => p.id !== currentUserId
  );

  const title = others.map((u: any) => u.name || u.email).join(', ') || 'Conversation';
  const initials =
    others.length === 1 ? getInitials(others[0].name || others[0].email) : `${others.length}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header — click anywhere to open details */}
      <header
        role="button"
        tabIndex={0}
        onClick={() => setShowDetails(true)}
        onKeyDown={(e) => e.key === 'Enter' && setShowDetails(true)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-900
                   border-b border-gray-200 dark:border-gray-800
                   shadow-sm cursor-pointer select-none shrink-0
                   hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
        aria-label="Open conversation details"
      >
        {/* Mobile hamburger */}
        <button
          className="p-1.5 -ml-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden transition shrink-0"
          onClick={(e) => { e.stopPropagation(); onMenuClick(); }}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
            ${others.length === 1
              ? 'bg-gradient-to-br from-blue-400 to-purple-500'
              : 'bg-gradient-to-br from-green-400 to-teal-500'}`}>
            {initials}
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900" />
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight text-[0.9rem]">
            {title}
          </p>
          <p className="text-xs text-green-500 leading-tight">Online</p>
        </div>

        {/* Action buttons — stop propagation so header click doesn't fire */}
        <div
          className="flex items-center gap-0.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-500 hover:text-gray-700" aria-label="Voice call">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-500 hover:text-gray-700" aria-label="Video call">
            <Video className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(true)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Conversation details"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <MessageList conversationId={conversation.id} />

      {/* Input */}
      <MessageInput />

      {/* Detail modal */}
      {showDetails && (
        <ChatDetailModal
          conversation={conversation}
          currentUserId={currentUserId}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}
