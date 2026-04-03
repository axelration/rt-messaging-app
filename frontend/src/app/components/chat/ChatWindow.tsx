'use client';

import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
export default function ChatWindow() {
  return (
    <div className="flex flex-col flex-1">
      {/* <MessageList /> */}
      <MessageInput />
    </div>
  );
}