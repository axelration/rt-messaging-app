/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { setConversation } from '@/store/chat.store';

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);

  function handleSelectConversation(conv: any) {
    setActiveConversation(conv);
    setConversation(conv.id);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] dark:bg-gray-950">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static column on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[320px] flex flex-col
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <ChatSidebar
          activeConversationId={activeConversation?.id ?? null}
          onSelect={handleSelectConversation}
        />
      </aside>

      {/* Main panel */}
      <main className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            onMenuClick={() => setSidebarOpen(true)}
          />
        ) : (
          <EmptyState onMenuClick={() => setSidebarOpen(true)} />
        )}
      </main>
    </div>
  );
}

function EmptyState({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="relative flex flex-1 h-full flex-col items-center justify-center gap-4 text-gray-400 bg-[#f0f2f5] dark:bg-gray-950">
      {/* Hamburger for mobile when no conversation selected */}
      <button
        className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden transition"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="p-5 rounded-full bg-gray-200 dark:bg-gray-800">
        <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">Your messages</p>
        <p className="text-sm text-gray-400">Select a conversation or start a new one.</p>
      </div>
    </div>
  );
}
