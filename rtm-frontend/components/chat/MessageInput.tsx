'use client';

import { useState, useRef } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { getConversation } from '@/store/chat.store';
import { usei18n } from '@/hooks/language';

export default function MessageInput() {
  const { t } = usei18n();
  const [text, setText] = useState('');
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function send() {
    const trimmed = text.trim();
    const convId = getConversation();
    if (!trimmed || !convId) return;

    const socket = getSocket();
    socket.emit('sendMessage', {
      conversationId: convId,
      content: trimmed,
    });

    setText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter adds a newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
      return;
    }
    emitTyping();
  }

  function emitTyping() {
    const socket = getSocket();
    const convId = getConversation();
    if (!convId) return;

    socket.emit('typing', { conversationId: convId });

    // Debounce: stop sending typing events while the user keeps typing
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      typingTimeout.current = null;
    }, 1000);
  }

  // Auto-grow textarea height
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  }

  return (
    <div className="shrink-0 flex items-end gap-2 px-4 py-3 bg-[#f0f2f5] dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Attachment button */}
      <button
        type="button"
        className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition shrink-0"
        aria-label="Attach file"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      {/* Input area */}
      <div className="flex-1 flex items-end gap-2 bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-sm">
        {/* Emoji button */}
        <button
          type="button"
          className="text-gray-400 hover:text-yellow-500 transition shrink-0 pb-0.5"
          aria-label="Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Auto-growing textarea */}
        <textarea
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t.send ? `Message…` : 'Message…'}
          className="flex-1 resize-none bg-transparent text-sm text-gray-800 dark:text-gray-100
                     placeholder:text-gray-400 outline-none leading-relaxed max-h-[120px]
                     py-0.5 overflow-y-auto"
        />
      </div>

      {/* Send button */}
      <button
        type="button"
        onClick={send}
        disabled={!text.trim()}
        aria-label="Send message"
        className={`p-2.5 rounded-full shrink-0 transition
          ${text.trim()
            ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
