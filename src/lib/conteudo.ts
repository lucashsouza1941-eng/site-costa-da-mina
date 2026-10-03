// Única porta de leitura do conteúdo. As páginas não importam src/content
// diretamente: quando houver CMS ou painel (/admin), só este arquivo muda.
import { projetos } from '../content/projetos.ts';
import { agenda, galeria, indicadores, noticias, parceiros } from '../content/colecoes.ts';
import type { Demonstracao, Evento, Noticia, SlugProjeto } from '../content/tipos.ts';

const mostrarExemplos = () => process.env.NODE_ENV !== 'production';

/** Em produção, descarta qualquer item marcado como exemplo. */
export function semExemplos<T extends Demonstracao>(itens: T[], incluirExemplos = mostrarExemplos()): T[] {
  return incluirExemplos ? itens : itens.filter((i) => !i.exemplo);
}

export const listarProjetos = () => projetos;
export const buscarProjeto = (slug: string) => projetos.find((p) => p.slug === slug);

export function listarEventos(opcoes: { aPartirDe?: string; projeto?: SlugProjeto } = {}): Evento[] {
  const hoje = opcoes.aPartirDe ?? new Date().toISOString().slice(0, 10);
  return semExemplos(agenda)
    .filter((e) => e.data >= hoje && (!opcoes.projeto || e.projeto === opcoes.projeto))
    .sort((a, b) => a.data.localeCompare(b.data));
}

export function listarNoticias(limite?: number): Noticia[] {
  const lista = semExemplos(noticias).sort((a, b) => b.data.localeCompare(a.data));
  return limite ? lista.slice(0, limite) : lista;
}

export const buscarNoticia = (slug: string) => semExemplos(noticias).find((n) => n.slug === slug);

export const listarGaleria = () => semExemplos(galeria);
export const listarParceiros = () => semExemplos(parceiros);
export const listarIndicadores = () => indicadores;
