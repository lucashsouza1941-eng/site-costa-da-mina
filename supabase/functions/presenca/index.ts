// POST /functions/v1/presenca — a participante confirma presença na aula
// cuja chamada está aberta, informando o código da inscrição ou o WhatsApp.
// A segurança não depende do endereço do QR: só funciona com a chamada
// aberta pela equipe e com uma inscrição confirmada na turma.
import { normalizarCodigo, normalizarWhatsapp } from '../_compartilhado/regras.ts';
import { chaveDoCliente, clienteServico, codigoDoErro, dentroDoLimite, erro, json, lerPedido } from '../_compartilhado/http.ts';

Deno.serve(async (req) => {
  const corpo = await lerPedido(req);
  if (corpo instanceof Response) return corpo;

  if (typeof corpo.site === 'string' && corpo.site !== '') return erro(req, 'ROBO');

  const bruto = typeof corpo.identificador === 'string' ? corpo.identificador.slice(0, 40) : '';
  const identificador = normalizarCodigo(bruto) ?? normalizarWhatsapp(bruto);
  if (!identificador) return erro(req, 'IDENTIFICADOR_INVALIDO');

  const db = clienteServico();
  try {
    // A turma inteira pode usar o mesmo Wi-Fi: limite generoso por IP e
    // limite apertado por identificador (dificulta tentativa e erro).
    const porIp = await dentroDoLimite(db, 'presenca-ip', await chaveDoCliente(req), 120, 600);
    const porId = await dentroDoLimite(db, 'presenca-id', await chaveDoCliente(req, identificador), 6, 600);
    if (!porIp || !porId) return erro(req, 'MUITAS_TENTATIVAS');
  } catch {
    return erro(req, 'INDISPONIVEL');
  }

  const { data, error } = await db.rpc('confirmar_presenca_publica', { p_identificador: identificador });
  if (error) return erro(req, codigoDoErro(error, 'JA_REGISTRADA'));

  return json(req, 200, { ok: true, confirmadas: data.confirmadas });
});
