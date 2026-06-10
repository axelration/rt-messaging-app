/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { usei18n } from '@/hooks/language';

type Props = {
  conversation: any;
  currentUserId: string;
  isActive: boolean;
  onSelect: () => void; // caller already knows which conv; no need to pass id back
};

function getInitials(label: string) {
  return label
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function formatTime(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const AVATAR_COLORS = [
  'from-blue-400 to-purple-500',
  'from-green-400 to-teal-500',
  'from-orange-400 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-400 to-blue-600',
];

export default function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onSelect,
}: Props) {
  const { t } = usei18n();

  const others = (conversation.participants ?? []).filter(
    (p: any) => p.id !== currentUserId
  );

  const title = others.map((u: any) => u.name || u.email).join(', ') || 'You';
  const initials = others.length === 1
    ? getInitials(others[0].name || others[0].email)
    : `${others.length}`;

  // Stable color per conversation
  const colorIdx = conversation.id
    ? conversation.id.charCodeAt(0) % AVATAR_COLORS.length
    : 0;
  const gradient = others.length > 1
    ? 'from-green-400 to-teal-500'
    : AVATAR_COLORS[colorIdx];

  const lastContent = conversation.lastMessage?.content;
  const lastTime = formatTime(conversation.lastMessage?.createdAt ?? conversation.updatedAt);

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition text-left mb-0.5
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-950/60'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
        }`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
        {initials}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate
            ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
            {title}
          </span>
          {lastTime && (
            <span className="text-[11px] text-gray-400 shrink-0">{lastTime}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {lastContent || t.no_messages || 'No messages yet'}
        </p>
      </div>
    </button>
  );
}
