'use client';
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}