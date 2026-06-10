/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { usei18n } from '@/hooks/language';

type Props = {
  conversation: any;
  currentUserId: string;
  isActive: boolean;
  onSelect: (id: string) => void;
};

export default function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onSelect,
}: Props) {
  const { t } = usei18n();
  const otherUsers = conversation.participants.filter(
    (p: any) => p.id !== currentUserId
  );

  const title =
    otherUsers.map((u: any) => u.email).join(', ') || 'You';

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={`p-3 rounded cursor-pointer mb-2 transition
        ${isActive ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
      `}
    >
      <div className="font-medium truncate">{title}</div>

      <div className="text-sm text-gray-500 truncate">
        {conversation.lastMessage?.content || t.no_messages}
      </div>
    </div>
  );
}