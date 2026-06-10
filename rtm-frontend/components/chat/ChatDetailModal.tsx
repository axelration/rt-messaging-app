/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Mail, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  conversation: any;
  currentUserId: string | null;
  onClose: () => void;
};

function getInitials(email: string, name?: string) {
  const source = name || email;
  return source
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const AVATAR_GRADIENTS = [
  'from-blue-400 to-purple-500',
  'from-green-400 to-teal-500',
  'from-orange-400 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-400 to-blue-600',
];

export default function ChatDetailModal({ conversation, currentUserId, onClose }: Props) {
  const participants: any[] = conversation.participants ?? [];
  const createdAt = conversation.createdAt
    ? new Date(conversation.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Conversation Details</DialogTitle>
          {createdAt && (
            <DialogDescription>Created {createdAt}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Participants section */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Participants ({participants.length})
              </p>
            </div>

            <div className="space-y-2">
              {participants.map((p: any, idx: number) => {
                const isMe = p.id === currentUserId;
                const initials = getInitials(p.email, p.name);
                const gradient = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];

                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {p.name || p.email}
                        </p>
                        {isMe && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 font-medium shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      {p.name && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          {p.email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-1" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
