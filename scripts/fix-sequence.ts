import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function fixSequence() {
  console.log('Fixing products_id_seq...');
  const result = await sql`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`;
  console.log('Done. Sequence value:', result);
  process.exit(0);
}

fixSequence().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
