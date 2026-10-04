// Datas em pt-BR (fuso de São Paulo). Datas do conteúdo vêm como AAAA-MM-DD.
const meio = (iso: string) => new Date(`${iso}T12:00:00-03:00`);

export const diaDoMes = (iso: string) => meio(iso).toLocaleDateString('pt-BR', { day: '2-digit', timeZone: 'America/Sao_Paulo' });

export const mesAbreviado = (iso: string) =>
  meio(iso).toLocaleDateString('pt-BR', { month: 'short', timeZone: 'America/Sao_Paulo' }).replace('.', '').toUpperCase();

export const dataPorExtenso = (iso: string) =>
  meio(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' });

export const dataCompleta = (iso: string) =>
  meio(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });
