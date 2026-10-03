// Lista as informações ainda não confirmadas e atualiza docs/PENDENCIAS.md.
// Uso: npm run pendencias
import { writeFileSync } from 'node:fs';
import { pendencias } from '../src/data/pendencias.ts';

const linhas = [
  '# Pendências de conteúdo',
  '',
  'Gerado por `npm run pendencias` a partir de `src/data/pendencias.ts`. Não edite à mão.',
  '',
  'Nada desta lista aparece no site publicado. Em `npm run dev`, cada item aparece como um aviso tracejado em vermelho no ponto da página onde a informação entraria.',
  '',
  `Total: **${pendencias.length}**`,
  '',
];
for (const p of pendencias) {
  linhas.push(`## ${p.assunto}`, '', `- **id:** \`${p.id}\``, `- **Onde:** ${p.onde}`, `- **Situação:** ${p.situacao}`, '');
}
writeFileSync(new URL('../docs/PENDENCIAS.md', import.meta.url), linhas.join('\n'));

for (const p of pendencias) console.log(`• ${p.assunto} (${p.onde})`);
console.log(`\n${pendencias.length} pendências. docs/PENDENCIAS.md atualizado.`);
