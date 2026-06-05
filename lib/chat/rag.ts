import { getOpenAI } from './openai';
import { embed } from './embeddings';
import { db } from '@/lib/db';
import { chatDocumentChunks } from '@/db/schema';
import { cosineDistance } from 'drizzle-orm';

const SYSTEM_PROMPT = `You are a helpful customer support assistant for AURFIA, a minimal jewelry brand based in the US selling 925 sterling silver jewelry.

Answer the customer's question using ONLY the context provided below. If the context doesn't contain enough information to answer, politely say you don't know.

When mentioning products, reference their names clearly. Be concise, friendly, and professional.

Context:
{context}`;

export async function searchRelevantChunks(query: string, limit = 5) {
  const queryEmbedding = await embed(query);

  const results = await db
    .select({
      content: chatDocumentChunks.content,
      metadata: chatDocumentChunks.metadata,
      distance: cosineDistance(chatDocumentChunks.embedding, queryEmbedding),
    })
    .from(chatDocumentChunks)
    .orderBy(cosineDistance(chatDocumentChunks.embedding, queryEmbedding))
    .limit(limit);

  return results;
}

export async function generateResponse(
  query: string,
  contextChunks: { content: string; metadata: string | null }[]
) {
  const contextText = contextChunks
    .map((c) => {
      let meta = '';
      if (c.metadata) {
        try {
          const parsed = JSON.parse(c.metadata);
          meta = parsed.title || parsed.source || '';
        } catch {}
      }
      return meta ? `[${meta}]\n${c.content}` : c.content;
    })
    .join('\n\n---\n\n');

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT.replace('{context}', contextText) },
      { role: 'user', content: query },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });

  return response.choices[0].message.content ?? 'Sorry, I could not generate a response.';
}
