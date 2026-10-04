// Testa o módulo de cursos no navegador, ponta a ponta:
// 1. sobe o Supabase falso (SQL real da migração em PGlite);
// 2. gera o site apontando para ele;
// 3. roda tests/e2e-cursos;
// 4. refaz o build normal (sem configuração do Supabase).
// Uso: npm run e2e:cursos
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
// shell só para o npm (no Windows, npm.cmd precisa dele); o Node é chamado
// direto, porque o caminho dele pode ter espaços ("C:\Program Files\…")
const rodar = (cmd, args, env = {}) => {
  const r = spawnSync(cmd, args, { cwd: raiz, stdio: 'inherit', env: { ...process.env, ...env }, shell: cmd === npm && process.platform === 'win32' });
  return r.status ?? 1;
};

const supabase = spawn(process.execPath, ['tests/apoio/supabase-falso.mjs'], { cwd: raiz, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((resolver, rejeitar) => {
  supabase.stdout.on('data', (d) => String(d).includes('Supabase falso em') && resolver());
  supabase.on('exit', (c) => rejeitar(new Error(`Supabase falso saiu (${c})`)));
});

let status = 1;
try {
  status = rodar(npm, ['run', 'build'], { NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'teste-local' });
  if (status === 0) status = rodar(process.execPath, ['--test', '--test-concurrency=1', 'tests/e2e-cursos/cursos.test.mjs']);
} finally {
  supabase.kill();
  console.log('\nRefazendo o build normal (sem Supabase)…');
  rodar(npm, ['run', 'build']);
}
process.exit(status);
