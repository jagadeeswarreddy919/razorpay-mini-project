'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, ShieldCheck, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderType: 'CUSTOMER' | 'SUPPORT_AGENT';
  senderName: string;
  message: string;
  createdAt: string;
}

interface ChatPanelProps {
  acknowledgementNumber: string;
  senderType: 'CUSTOMER' | 'SUPPORT_AGENT';
  senderName: string;
  draftText?: string;
  onClearDraft?: () => void;
}

export function ChatPanel({
  acknowledgementNumber,
  senderType,
  senderName,
  draftText,
  onClearDraft,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/complaints/${acknowledgementNumber}/chat`);
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Polling every 3s
    return () => clearInterval(interval);
  }, [acknowledgementNumber]);

  useEffect(() => {
    if (draftText) {
      setNewMessage(draftText);
    }
  }, [draftText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/complaints/${acknowledgementNumber}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderType,
          senderName,
          message: newMessage.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNewMessage('');
        if (onClearDraft) onClearDraft();
        await fetchMessages();
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col h-[480px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-mono uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-purple-600" />
          {senderType === 'CUSTOMER' ? 'Live Support Resolution Chat' : 'Customer Messaging Panel'}
        </h3>
        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
          ● LIVE AGENT ONLINE
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 italic">
            No messages yet. Send a message to start conversation with support.
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderType === senderType;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono">
                  {m.senderType === 'SUPPORT_AGENT' ? (
                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                  ) : (
                    <User className="w-3 h-3 text-blue-600" />
                  )}
                  {m.senderName} • {new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    isMe
                      ? 'bg-purple-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={senderType === 'CUSTOMER' ? 'Write message to support lead...' : 'Type message or use AI Draft...'}
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-full transition-all disabled:opacity-50 flex items-center gap-1.5 shadow"
        >
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-purple-200" />}
          Send
        </button>
      </form>
    </div>
  );
}
