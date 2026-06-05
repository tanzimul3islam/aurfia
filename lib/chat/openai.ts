import 'dotenv/config';

const apiKey = process.env.OPENAI_API_KEY;

let openaiInstance: import('openai').default | null = null;

if (apiKey) {
  const OpenAI = require('openai').default;
  openaiInstance = new OpenAI({ apiKey });
}

export function getOpenAI() {
  if (!openaiInstance) {
    throw new Error('OPENAI_API_KEY is not configured. Set it in .env');
  }
  return openaiInstance;
}
