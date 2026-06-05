'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, ChevronDown, Plus } from 'lucide-react';
import { ChatHeader } from './chat-header';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { sendChatMessage, getMessages } from '@/actions/chat/sendMessage';
import { createConversation, listConversations, deleteConversation } from '@/actions/chat/conversations';

interface Message {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: string | null;
}

interface Conv {
  id: number;
  userId: string;
  title: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConvs, setShowConvs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConvs = useCallback(async () => {
    const data = await listConversations();
    setConvs(data);
  }, []);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    await loadConvs();
  }, [loadConvs]);

  const handleSelectConv = useCallback(async (convId: number) => {
    setActiveConvId(convId);
    setShowConvs(false);
    const msgs = await getMessages(convId);
    setMessages(msgs);
  }, []);

  const handleNewConv = useCallback(async () => {
    const conv = await createConversation();
    if (conv) {
      setActiveConvId(conv.id);
      setMessages([]);
      await loadConvs();
    }
  }, [loadConvs]);

  const handleDeleteConv = useCallback(async () => {
    if (!activeConvId) return;
    await deleteConversation(activeConvId);
    setActiveConvId(null);
    setMessages([]);
    await loadConvs();
  }, [activeConvId, loadConvs]);

  const handleSend = useCallback(async (text: string) => {
    if (!activeConvId) return;
    setLoading(true);
    const userMsg: Message = { id: Date.now(), conversationId: activeConvId, role: 'user', content: text, createdAt: null };
    setMessages((prev) => [...prev, userMsg]);

    const result = await sendChatMessage(activeConvId, text);
    setLoading(false);

    if (result.reply) {
      const botMsg: Message = { id: Date.now() + 1, conversationId: activeConvId, role: 'assistant', content: result.reply, createdAt: null };
      setMessages((prev) => [...prev, botMsg]);
    }
  }, [activeConvId]);

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-5 right-5 z-50 bg-black text-white p-3.5 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  const activeConv = convs.find((c) => c.id === activeConvId);

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[360px] max-w-[calc(100vw-40px)] h-[520px] max-h-[calc(100vh-120px)] bg-white rounded-xl shadow-2xl border border-black/10 flex flex-col overflow-hidden">
      {showConvs ? (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 bg-black text-white">
            <span className="text-sm font-medium">Conversations</span>
            <button onClick={() => setShowConvs(false)} className="p-1 hover:bg-white/10 rounded">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <button
              onClick={handleNewConv}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-[#F5F5F0] transition-colors mb-1"
            >
              <Plus size={16} />
              New conversation
            </button>
            {convs.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectConv(c.id)}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors mb-0.5 ${
                  c.id === activeConvId ? 'bg-[#F5F5F0] font-medium' : 'hover:bg-[#F5F5F0]'
                }`}
              >
                <span className="truncate block">{c.title}</span>
              </button>
            ))}
            {convs.length === 0 && (
              <p className="text-xs text-neutral-400 text-center py-8">No conversations yet</p>
            )}
          </div>
        </>
      ) : (
        <>
          <ChatHeader
            title={activeConv?.title ?? 'New conversation'}
            onClose={() => setOpen(false)}
            onDelete={activeConvId ? handleDeleteConv : undefined}
          />

          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {!activeConvId ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <MessageCircle size={32} className="text-neutral-300 mb-3" />
                <p className="text-sm text-neutral-500 mb-4">Ask about products, orders, or anything about AURFIA.</p>
                <button
                  onClick={handleNewConv}
                  className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  Start chatting
                </button>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <ChatMessage key={m.id} role={m.role} content={m.content} />
                ))}
                {loading && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-[#F5F5F0] px-3.5 py-2.5 rounded-lg rounded-bl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {activeConvId && (
            <ChatInput onSend={handleSend} disabled={loading} />
          )}

          <button
            onClick={() => { setShowConvs(true); loadConvs(); }}
            className="flex items-center justify-center gap-1 py-2 text-xs text-neutral-400 hover:text-neutral-600 border-t border-black/5 transition-colors"
          >
            <ChevronDown size={14} />
            All conversations
          </button>
        </>
      )}
    </div>
  );
}
