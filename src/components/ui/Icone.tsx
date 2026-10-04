// Ícones de traço desenhados para o site (sem biblioteca externa).
// Decorativos por padrão; com `rotulo`, viram imagem com nome acessível.
import type { SVGProps } from 'react';

export type NomeIcone =
  | 'cultura'
  | 'educacao'
  | 'arte'
  | 'comunidade'
  | 'renda'
  | 'territorio'
  | 'projetos'
  | 'seta'
  | 'menu'
  | 'fechar'
  | 'busca'
  | 'calendario'
  | 'local'
  | 'relogio'
  | 'email'
  | 'telefone'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'coracao'
  | 'pix'
  | 'copiar'
  | 'mais'
  | 'anterior'
  | 'proximo';

const desenhos: Record<NomeIcone, React.ReactNode> = {
  // nó de quatro laços: referência às tranças
  cultura: (
    <>
      <path d="M12 12c-2.5-2.5-2.5-6 0-8 2.5 2 2.5 5.5 0 8zM12 12c2.5 2.5 2.5 6 0 8-2.5-2-2.5-5.5 0-8zM12 12c2.5-2.5 6-2.5 8 0-2 2.5-5.5 2.5-8 0zM12 12c-2.5 2.5-6 2.5-8 0 2-2.5 5.5-2.5 8 0z" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  educacao: (
    <>
      <path d="M3 5.5c3-1.3 6-1.3 9 .5 3-1.8 6-1.8 9-.5v13c-3-1.3-6-1.3-9 .5-3-1.8-6-1.8-9-.5z" />
      <path d="M12 6v13" />
    </>
  ),
  arte: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 1.9-1 1.4-2.2-.6-1.4.3-2.8 1.8-2.8H17a4 4 0 0 0 4-4c0-5-4-9-9-9z" />
      <circle cx="7.5" cy="11" r="1.2" />
      <circle cx="10" cy="7" r="1.2" />
      <circle cx="14.5" cy="7" r="1.2" />
    </>
  ),
  comunidade: (
    <>
      <circle cx="12" cy="7" r="2.6" />
      <circle cx="5.5" cy="10" r="2.1" />
      <circle cx="18.5" cy="10" r="2.1" />
      <path d="M7.5 20v-1.5a4.5 4.5 0 0 1 9 0V20M2 20v-1a3.5 3.5 0 0 1 4.5-3.3M22 20v-1a3.5 3.5 0 0 0-4.5-3.3" />
    </>
  ),
  renda: (
    <>
      <path d="M4 20V14M9.5 20v-8M15 20v-5M20.5 20V9" />
      <path d="M4 10l5-4 4 3 7-6M16 3h4v4" />
    </>
  ),
  territorio: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <path d="M9 10l3-3 3 3-3 3z" />
    </>
  ),
  projetos: (
    <>
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M9 2.5h6v3H9zM8 11h8M8 15h5" />
    </>
  ),
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  anterior: <path d="M15 5l-7 7 7 7" />,
  proximo: <path d="M9 5l7 7-7 7" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fechar: <path d="M6 6l12 12M18 6L6 18" />,
  busca: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  local: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3.8 7l8.2 6 8.2-6" />
    </>
  ),
  telefone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
  ),
  whatsapp: (
    <>
      <path d="M4.2 19.8l1.1-3.9A8.3 8.3 0 1 1 8.4 19z" />
      <path d="M9 8.6c.2-.5.6-.6 1-.6l.6 1.5-.6.8c.5 1.1 1.4 2 2.5 2.5l.8-.6 1.5.6c0 .4-.1.8-.6 1-1.9.7-5.8-3.2-5.2-5.2z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5z" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10 9.2v5.6l4.8-2.8z" />
    </>
  ),
  coracao: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  // losangos encadeados (sem usar a marca registrada do Pix)
  pix: <path d="M12 3l4 4-4 4-4-4zM12 13l4 4-4 4-4-4zM7 8l4 4-4 4-4-4zM17 8l4 4-4 4-4-4z" />,
  copiar: (
    <>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
    </>
  ),
  mais: <path d="M12 5v14M5 12h14" />,
};

type Props = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  nome: NomeIcone;
  /** Texto para leitores de tela. Sem ele, o ícone é decorativo. */
  rotulo?: string;
  espessura?: number;
};

export function Icone({ nome, rotulo, espessura = 1.8, className, ...resto }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={espessura}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? 'size-5'}
      aria-hidden={rotulo ? undefined : true}
      role={rotulo ? 'img' : undefined}
      aria-label={rotulo}
      focusable="false"
      {...resto}
    >
      {desenhos[nome]}
    </svg>
  );
}
