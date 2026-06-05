export interface Chunk {
  content: string;
  metadata?: string;
}

export function chunkDocument(text: string, source: string): Chunk[] {
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  const chunks: Chunk[] = [];
  let buffer = '';
  const maxLen = 1000;
  const overlap = 100;

  for (const p of paragraphs) {
    if ((buffer + p).length > maxLen && buffer.length > 0) {
      chunks.push({
        content: buffer.trim(),
        metadata: JSON.stringify({ source }),
      });
      buffer = buffer.slice(-overlap) + '\n\n' + p;
    } else {
      buffer += (buffer ? '\n\n' : '') + p;
    }
  }

  if (buffer.trim()) {
    chunks.push({
      content: buffer.trim(),
      metadata: JSON.stringify({ source }),
    });
  }

  return chunks;
}

export function chunkProductText(
  productId: number,
  title: string,
  description: string | null,
  brand: string | null,
  category: string | null,
  details: string | null
): { content: string; metadata: string }[] {
  const parts = [`Product: ${title}`];
  if (brand) parts.push(`Brand: ${brand}`);
  if (category) parts.push(`Category: ${category}`);
  if (description) parts.push(`Description: ${description}`);
  if (details) {
    try {
      const parsed = JSON.parse(details);
      if (Array.isArray(parsed)) {
        parts.push(`Details: ${parsed.join(', ')}`);
      } else if (typeof parsed === 'object') {
        parts.push(`Details: ${JSON.stringify(parsed)}`);
      }
    } catch {
      parts.push(`Details: ${details}`);
    }
  }

  const text = parts.join('\n');
  const chunks: { content: string; metadata: string }[] = [];

  if (text.length <= 1000) {
    chunks.push({
      content: text,
      metadata: JSON.stringify({ type: 'product', productId, title }),
    });
  } else {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let buffer = '';
    for (const s of sentences) {
      if ((buffer + s).length > 1000 && buffer.length > 0) {
        chunks.push({
          content: buffer.trim(),
          metadata: JSON.stringify({ type: 'product', productId, title }),
        });
        buffer = s;
      } else {
        buffer += s;
      }
    }
    if (buffer.trim()) {
      chunks.push({
        content: buffer.trim(),
        metadata: JSON.stringify({ type: 'product', productId, title }),
      });
    }
  }

  return chunks;
}
