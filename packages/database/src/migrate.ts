import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

async function main() {
  const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error('Set SUPABASE_DB_URL / DATABASE_URL');
    process.exit(1);
  }
  const sql = postgres(url, { max: 1 });
  const files = ['001_initial.sql', '002_rls_policies.sql'];
  for (const f of files) {
    const content = readFileSync(join(__dirname, '../migrations', f), 'utf-8');
    console.log(`→ Migrating ${f}...`);
    await sql.unsafe(content);
    console.log(`✓ ${f} done`);
  }
  await sql.end();
  console.log('All migrations applied');
}
main().catch((e) => { console.error(e); process.exit(1); });
