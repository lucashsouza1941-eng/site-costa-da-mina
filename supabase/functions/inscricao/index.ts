// POST /functions/v1/inscricao — inscrição pública em uma turma.
// Ordem: origem → robô (armadilha/tempo) → limite por IP → captcha →
// validação → banco (que valida tudo de novo e decide vaga ou espera).
import { VERSAO_POLITICA, pareceRobo, validarInscricao } from '../_compartilhado/regras.ts';
import {
  captchaValido,
  chaveDoCliente,
  clienteServico,
  codigoDoErro,
  dentroDoLimite,
  erro,
  json,
  lerPedido,
} from '../_compartilhado/http.ts';

Deno.serve(async (req) => {
  const corpo = await lerPedido(req);
  if (corpo instanceof Response) return corpo;

  if (pareceRobo(corpo)) return erro(req, 'ROBO');

  const db = clienteServico();
  try {
    if (!(await dentroDoLimite(db, 'inscricao', await chaveDoCliente(req), 8, 600))) {
      return erro(req, 'MUITAS_TENTATIVAS');
    }
  } catch {
    return erro(req, 'INDISPONIVEL');
  }

  if (!(await captchaValido(req, corpo.captcha))) return erro(req, 'CAPTCHA');

  const validacao = validarInscricao(corpo);
  if (!validacao.ok) {
    return json(req, 400, { ok: false, codigo: 'DADOS_INVALIDOS', mensagem: 'Confira os campos indicados.', campos: validacao.erros });
  }
  const d = validacao.dados;

  const { data, error } = await db.rpc('inscrever_publico', {
    p_turma: d.turma,
    p_nome: d.nome,
    p_nascimento: d.nascimento,
    p_whatsapp: d.whatsapp,
    p_email: d.email,
    p_bairro: d.bairro,
    p_disponibilidade: d.disponibilidade,
    p_consentimento: d.consentimento,
    p_versao_politica: VERSAO_POLITICA,
  });
  if (error) return erro(req, codigoDoErro(error, 'JA_INSCRITA'));

  // Devolve só o necessário para a tela de confirmação.
  return json(req, 200, {
    ok: true,
    status: data.status,
    codigo: data.codigo,
    posicao_espera: data.posicao_espera,
  });
});
