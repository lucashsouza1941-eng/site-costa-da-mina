// Formulário público de inscrição.
import { cursosConfigurado } from './lib/config';
import { chamarFuncao, turmasAbertas, type TurmaPublica } from './lib/api-publica';
import { validarInscricao, mensagemDe } from '../../../supabase/functions/_compartilhado/regras';
import { el, formatarData, formatarDataHora } from './lib/dom';

declare global {
  interface Window {
    turnstile?: {
      render: (alvo: HTMLElement, opcoes: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      getResponse: (id?: string) => string | undefined;
    };
  }
}

const raiz = document.querySelector<HTMLElement>('[data-cursos]');

if (raiz && cursosConfigurado) iniciar(raiz);

async function iniciar(raiz: HTMLElement) {
  const estado = raiz.querySelector<HTMLElement>('[data-estado]')!;
  const blocoTurmas = raiz.querySelector<HTMLElement>('[data-turmas]')!;
  const lista = raiz.querySelector<HTMLElement>('[data-lista-turmas]')!;
  const form = raiz.querySelector<HTMLFormElement>('[data-form]')!;
  const opcoes = raiz.querySelector<HTMLElement>('[data-opcoes-turma]')!;
  const confirmacao = raiz.querySelector<HTMLElement>('[data-confirmacao]')!;
  const resumo = raiz.querySelector<HTMLElement>('[data-resumo-erros]')!;
  const botao = raiz.querySelector<HTMLButtonElement>('[data-enviar]')!;
  const iniciadoEm = Date.now();

  let turmas: TurmaPublica[] = [];
  try {
    turmas = await turmasAbertas();
  } catch {
    estado.replaceChildren(
      el('div', { class: 'aviso aviso--erro' }, [
        el('h2', {}, 'Não foi possível carregar as turmas'),
        el('p', {}, 'Verifique sua conexão e recarregue a página. Se continuar, fale com a equipe pelo WhatsApp.'),
      ]),
    );
    return;
  }

  if (turmas.length === 0) {
    estado.replaceChildren(
      el('div', { class: 'aviso' }, [
        el('h2', {}, 'Nenhuma inscrição aberta no momento'),
        el('p', {}, 'Quando uma nova turma abrir, ela aparece aqui. Acompanhe as novidades no Instagram do Instituto.'),
      ]),
    );
    return;
  }

  estado.replaceChildren();
  lista.replaceChildren(...turmas.map(cartaoTurma));
  opcoes.replaceChildren(
    ...turmas.map((t, i) =>
      el('label', { class: 'opcao' }, [
        el('input', { type: 'radio', name: 'turma', value: t.id, required: '', checked: turmas.length === 1 && i === 0 ? '' : null, 'aria-describedby': 'erro-turma' }),
        el('span', {}, [el('strong', {}, `${t.curso} · ${t.turma}`), t.dias_horarios ? el('br') : null, t.dias_horarios ?? '']),
      ]),
    ),
  );
  blocoTurmas.hidden = false;
  form.hidden = false;

  // captcha (Cloudflare Turnstile), quando configurado
  const chaveCaptcha = raiz.dataset.turnstile;
  let idCaptcha: string | undefined;
  if (chaveCaptcha) {
    const alvo = raiz.querySelector<HTMLElement>('[data-captcha]')!;
    const renderizar = () => {
      if (!window.turnstile) return setTimeout(renderizar, 300);
      idCaptcha = window.turnstile.render(alvo, { sitekey: chaveCaptcha, language: 'pt-BR' });
    };
    renderizar();
  }

  raiz.querySelectorAll<HTMLButtonElement>('[data-escolher-turma]').forEach((b) =>
    b.addEventListener('click', () => {
      const radio = opcoes.querySelector<HTMLInputElement>(`input[value="${b.dataset.escolherTurma}"]`);
      if (radio) radio.checked = true;
      form.querySelector<HTMLElement>('#titulo-form')?.focus();
    }),
  );

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limparErros(form, resumo);

    const fd = new FormData(form);
    const corpo: Record<string, unknown> = {
      turma: fd.get('turma') ?? '',
      nome: fd.get('nome'),
      nascimento: fd.get('nascimento'),
      whatsapp: fd.get('whatsapp'),
      email: fd.get('email'),
      bairro: fd.get('bairro'),
      disponibilidade: fd.get('disponibilidade'),
      consentimento: fd.get('consentimento') === 'on',
      site: fd.get('site'),
      iniciado_em: iniciadoEm,
      captcha: idCaptcha !== undefined ? window.turnstile?.getResponse(idCaptcha) : undefined,
    };

    const validacao = validarInscricao(corpo);
    if (!validacao.ok) {
      mostrarErros(form, resumo, validacao.erros);
      return;
    }

    botao.disabled = true;
    botao.firstChild!.textContent = 'Enviando… ';
    const resposta = await chamarFuncao('inscricao', corpo);
    botao.disabled = false;
    botao.firstChild!.textContent = 'Enviar inscrição ';

    if (!resposta.ok) {
      if (idCaptcha !== undefined) window.turnstile?.reset(idCaptcha);
      if (resposta.campos) {
        mostrarErros(form, resumo, resposta.campos);
      } else {
        resumo.replaceChildren(el('p', {}, resposta.mensagem ?? mensagemDe(resposta.codigo ?? 'INDISPONIVEL')));
        resumo.hidden = false;
        resumo.focus();
      }
      return;
    }

    const turma = turmas.find((t) => t.id === corpo.turma);
    mostrarConfirmacao(confirmacao, resposta as unknown as Confirmacao, turma);
    form.hidden = true;
    blocoTurmas.hidden = true;
    confirmacao.hidden = false;
    confirmacao.focus();
  });
}

function cartaoTurma(t: TurmaPublica) {
  const detalhes: [string, string | null][] = [
    ['Quando', t.dias_horarios],
    ['Período', t.data_inicio ? `${formatarData(t.data_inicio)}${t.data_fim ? ` a ${formatarData(t.data_fim)}` : ''}` : null],
    ['Local', [t.local, t.endereco].filter(Boolean).join(' · ') || null],
    ['Carga horária', t.carga_horaria],
    ['Para quem', t.publico_alvo],
    ['Idade mínima', t.idade_minima !== null ? `${t.idade_minima} anos` : null],
    ['Inscrições até', t.inscricoes_fim ? formatarDataHora(t.inscricoes_fim) : null],
    ['Vagas', t.vagas_restantes > 0 ? `${t.vagas_restantes} disponíveis` : 'Vagas preenchidas: novas inscrições entram na lista de espera'],
  ];
  return el('li', { class: 'turma' }, [
    el('h3', {}, `${t.curso} · ${t.turma}`),
    t.curso_descricao ? el('p', {}, t.curso_descricao) : null,
    el(
      'dl',
      {},
      detalhes.filter(([, v]) => v).flatMap(([r, v]) => [el('dt', {}, r), el('dd', {}, v!)]),
    ),
    t.observacoes ? el('p', { class: 'dica' }, t.observacoes) : null,
    el('button', { type: 'button', class: 'botao', 'data-escolher-turma': t.id }, 'Quero esta turma'),
  ]);
}

type Confirmacao = { status: 'confirmada' | 'lista_espera'; codigo: string; posicao_espera: number | null };

function mostrarConfirmacao(alvo: HTMLElement, c: Confirmacao, turma?: TurmaPublica) {
  const naEspera = c.status === 'lista_espera';
  alvo.replaceChildren(
    el('div', { class: `aviso ${naEspera ? '' : 'aviso--sucesso'}` }, [
      el('h2', {}, naEspera ? `Você está na lista de espera (posição ${c.posicao_espera})` : 'Inscrição confirmada!'),
      turma ? el('p', {}, `${turma.curso} · ${turma.turma}`) : null,
      el('p', {}, 'Seu código de inscrição:'),
      el('p', { class: 'codigo-grande' }, c.codigo),
      el(
        'p',
        {},
        naEspera
          ? 'As vagas desta turma já foram preenchidas. Se uma vaga abrir, a equipe do Instituto entra em contato pelo WhatsApp informado.'
          : 'Guarde este código: anote, tire um print ou salve no celular. Você vai usá-lo para registrar presença nas aulas (também dá para usar o WhatsApp cadastrado).',
      ),
      el('button', { type: 'button', class: 'botao', 'data-copiar-codigo': c.codigo }, 'Copiar código'),
      el('p', { class: 'dica', role: 'status', 'data-aviso-copia': '' }),
    ]),
  );
  alvo.querySelector<HTMLButtonElement>('[data-copiar-codigo]')?.addEventListener('click', async () => {
    const aviso = alvo.querySelector<HTMLElement>('[data-aviso-copia]')!;
    try {
      await navigator.clipboard.writeText(c.codigo);
      aviso.textContent = 'Código copiado.';
    } catch {
      aviso.textContent = `Não foi possível copiar. Anote o código: ${c.codigo}`;
    }
  });
}

const ROTULOS: Record<string, string> = {
  turma: 'Turma',
  nome: 'Nome completo',
  nascimento: 'Data de nascimento',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  bairro: 'Bairro',
  disponibilidade: 'Disponibilidade de horário',
  consentimento: 'Autorização de uso dos dados',
};

function limparErros(form: HTMLFormElement, resumo: HTMLElement) {
  resumo.hidden = true;
  resumo.replaceChildren();
  form.querySelectorAll('.erro-campo').forEach((e) => (e.textContent = ''));
  form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
}

function mostrarErros(form: HTMLFormElement, resumo: HTMLElement, erros: Record<string, string | undefined>) {
  const itens: HTMLElement[] = [];
  for (const [campo, mensagem] of Object.entries(erros)) {
    if (!mensagem) continue;
    const saida = form.querySelector<HTMLElement>(`#erro-${campo}`);
    if (saida) saida.textContent = mensagem;
    const alvo = campo === 'turma' ? form.querySelector<HTMLInputElement>('input[name="turma"]') : form.querySelector<HTMLElement>(`#${campo}`);
    form.querySelectorAll<HTMLElement>(campo === 'turma' ? 'input[name="turma"]' : `#${campo}`).forEach((c) => c.setAttribute('aria-invalid', 'true'));
    const link = el('a', { href: `#${alvo?.id || campo}` }, `${ROTULOS[campo] ?? campo}: ${mensagem}`);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alvo?.focus();
    });
    itens.push(el('li', {}, [link]));
  }
  resumo.replaceChildren(
    el('h3', {}, itens.length === 1 ? 'Corrija 1 campo para continuar' : `Corrija ${itens.length} campos para continuar`),
    el('ul', {}, itens),
  );
  resumo.hidden = false;
  resumo.focus();
}
