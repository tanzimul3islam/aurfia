'use client';

import { MessageCircle, X, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  onClose: () => void;
  onDelete?: () => void;
}

export function ChatHeader({ title, onClose, onDelete }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 bg-black text-white">
      <div className="flex items-center gap-2">
        <MessageCircle size={18} />
        <span className="text-sm font-medium truncate max-w-[200px]">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            aria-label="Delete conversation"
          >
            <Trash2 size={15} />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
