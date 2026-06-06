import { listDocuments } from '@/actions/chat/documents';
import { ChatbotAdminClient } from './client';

export default async function ChatbotAdminPage() {
  const docs = await listDocuments();

  return (
    <div>
      <h1 className="text-2xl font-serif mb-6">Chatbot</h1>
      <ChatbotAdminClient docs={docs} />
    </div>
  );
}
