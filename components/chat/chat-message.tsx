'use client';

interface ChatMessageProps {
  role: string;
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
          isUser
            ? 'bg-black text-white rounded-br-sm'
            : 'bg-[#F5F5F0] text-[#0E0E0E] rounded-bl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
