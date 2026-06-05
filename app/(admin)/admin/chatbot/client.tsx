'use client';

import { useState } from 'react';
import { uploadDocument, deleteDocument, reindexProducts, listDocuments } from '@/actions/chat/documents';

interface Doc {
  id: number;
  title: string;
  fileType: string | null;
  chunkCount: number | null;
  createdAt: string | null;
}

export function ChatbotAdminClient({ docs: initial }: { docs: Doc[] }) {
  const [docs, setDocs] = useState(initial);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileType, setFileType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [status, setStatus] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setUploading(true);
    setStatus('');
    const fd = new FormData();
    fd.set('title', title);
    fd.set('content', content);
    if (fileType) fd.set('fileType', fileType);
    const result = await uploadDocument(fd);
    setUploading(false);
    if (result.success) {
      setTitle('');
      setContent('');
      setFileType('');
      setStatus('Document uploaded and indexed.');
      const updated = await listDocuments();
      setDocs(updated);
    } else {
      setStatus(result.error ?? 'Upload failed.');
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDocument(id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setStatus('Document deleted.');
  };

  const handleReindex = async () => {
    setReindexing(true);
    setStatus('');
    const result = await reindexProducts();
    setReindexing(false);
    if (result.success) {
      setStatus(`Reindexed ${result.productCount} products (${result.chunkCount} chunks).`);
    } else {
      setStatus('Reindexing failed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload */}
      <section className="bg-white rounded-lg border border-black/10 p-6">
        <h2 className="text-lg font-medium mb-4">Add Knowledge Document</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-600 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-black/30"
              placeholder="e.g. Shipping Policy"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-600 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-black/30 min-h-[120px]"
              placeholder="Paste or type the document content…"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-600 mb-1">File type (optional)</label>
            <input
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-black/30"
              placeholder="e.g. pdf, text, policy"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading…
              </>
            ) : 'Upload & Index'}
          </button>
        </form>
      </section>

      {/* Product Index */}
      <section className="bg-white rounded-lg border border-black/10 p-6">
        <h2 className="text-lg font-medium mb-2">Product Knowledge Base</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Index all 150+ products so the chatbot can answer product questions.
        </p>
        <button
          onClick={handleReindex}
          disabled={reindexing}
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          {reindexing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Indexing…
            </>
          ) : 'Reindex Products'}
        </button>
      </section>

      {/* Document List */}
      <section className="bg-white rounded-lg border border-black/10 p-6">
        <h2 className="text-lg font-medium mb-4">Uploaded Documents ({docs.length})</h2>
        {docs.length === 0 ? (
          <p className="text-sm text-neutral-400">No documents uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-neutral-400">
                    {d.fileType && `${d.fileType} · `}{d.chunkCount ?? 0} chunks · {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {status && (
        <p className="text-sm text-neutral-500 text-center">{status}</p>
      )}
    </div>
  );
}
