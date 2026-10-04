'use client';

// Liga os scripts do módulo de cursos (escritos em TypeScript sem framework)
// depois que a página estática é montada. Cada script procura seus elementos
// pelos atributos data-* e não roda se o Supabase não estiver configurado.
import { useEffect } from 'react';

const scripts = {
  inscricao: () => import('./inscricao'),
  presenca: () => import('./presenca'),
  painel: () => import('./painel/app'),
  'link-cursos': () => import('./link-cursos'),
} as const;

export function AtivarModulo({ qual }: { qual: keyof typeof scripts }) {
  useEffect(() => {
    void scripts[qual]().then((m) => m.montar());
  }, [qual]);
  return null;
}
