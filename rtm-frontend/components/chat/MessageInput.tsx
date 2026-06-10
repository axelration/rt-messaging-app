'use client';

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import { getConversation } from '@/store/chat.store';
import { usei18n } from '@/hooks/language';

export default function MessageInput() {
  const { t } = usei18n();
  const [text, setText] = useState('');

  function send() {
    const socket = getSocket();
    const convId = getConversation();

    if (!text || !convId) return;

    socket.emit('sendMessage', {
      conversationId: convId,
      content: text,
    });

    setText('');
  }

  function handleTyping() {
    const socket = getSocket();
    const convId = getConversation();

    socket.emit('typing', { conversationId: convId });
  }

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        className="flex-1 border p-2"
        value={text}
        onChange={(e) => 
          setText(e.target.value)
        }
        onKeyDown={(e) => {
          handleTyping();
        }}
      />
      <button onClick={send}>{t.send}</button>
    </div>
  );
}