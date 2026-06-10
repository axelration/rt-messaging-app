/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Search, X, Check, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type User = {
  id: string;
  email: string;
  name?: string;
};

type Props = {
  onClose: () => void;
  onCreated: (conversation: any) => void;
};

function getInitial(user: User) {
  return (user.name || user.email)[0].toUpperCase();
}

export default function CreateConversationModal({ onClose, onCreated }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced user search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch(`/users/search?q=${encodeURIComponent(query.trim())}`);
        setResults(Array.isArray(res) ? res : (res?.data ?? []));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function toggleUser(user: User) {
    setSelected((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  }

  async function handleCreate() {
    if (!selected.length || creating) return;
    setCreating(true);
    setError(null);
    try {
      const res = await apiFetch('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ participantIds: selected.map((u) => u.id) }),
      });
      onCreated(res?.data ?? res);
    } catch {
      setError('Failed to create conversation. Please try again.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Search for people to start a conversation with.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          {/* Selected user chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((u) => (
                <span
                  key={u.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                             bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                >
                  {u.name || u.email}
                  <button
                    onClick={() => toggleUser(u)}
                    className="hover:text-blue-900 dark:hover:text-blue-100 transition"
                    aria-label={`Remove ${u.name || u.email}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
            )}
            <input
              type="text"
              placeholder="Search by name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-9 py-2.5 text-sm border rounded-lg
                         outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200
                         placeholder:text-gray-400"
            />
          </div>

          {/* Results list */}
          <div className="rounded-lg border dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 max-h-56 overflow-y-auto">
            {!query.trim() ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                Type to search for people
              </div>
            ) : !searching && results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No users found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              results.map((user) => {
                const isSelected = !!selected.find((u) => u.id === user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => toggleUser(user)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 transition text-left
                      hover:bg-gray-50 dark:hover:bg-gray-800/60
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-950/50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {getInitial(user)}
                      </div>
                      <div className="min-w-0">
                        {user.name && (
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {user.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-500 shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 px-1">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={creating}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={selected.length === 0 || creating}
            >
              {creating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Creating…
                </>
              ) : selected.length > 1 ? (
                `Start Group Chat (${selected.length})`
              ) : (
                'Start Chat'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
