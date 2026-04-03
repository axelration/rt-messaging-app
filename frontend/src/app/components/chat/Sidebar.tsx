/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { setConversation, getConversation } from "@/app/store/chat.store";
import ConversationItem from "./ConversationItem";

export default function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch conversations from the server
    async function load() {
      const res = await apiFetch("/chat/conversations");
      setConversations(res);

      // decode user ID from JWT token
      const token = localStorage.getItem("accessToken");
      const payload = JSON.parse(atob(token!.split(".")[1]));
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
      {userId && conversations.map((c: any) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          currentUserId={userId}
          isActive={c.id === activeId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}