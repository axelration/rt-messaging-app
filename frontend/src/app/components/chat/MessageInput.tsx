'use client';

import { usei18n } from "@/app/hooks/language";
import { getSocket } from "@/app/lib/socket";
import { getConversation } from "@/app/store/chat.store";
import { useState } from "react";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { t } = usei18n();
  if (!t) return null; // Handle case where translations are not loaded yet

  function send() {
    const socket = getSocket();
    const convId = getConversation();
    
    if (!text || !convId) return;

    socket.emit('sendMessage', { conversationId: convId, content: text });

    setText("");
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
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
      />
      <button onClick={send}>{t.send}</button>
    </div>
  );
}