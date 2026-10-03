// Mostra o link "Cursos" na navegação só quando existe turma com
// inscrições abertas. Sem turma aberta (ou sem configuração), nada aparece.
import { turmasAbertas } from '../lib/api-publica';
import { cursosConfigurado } from '../lib/config';

const CHAVE = 'icm:cursos-abertos';
const VALIDADE_MS = 5 * 60 * 1000;

function lerCache(): boolean | null {
  try {
    const salvo = JSON.parse(sessionStorage.getItem(CHAVE) ?? 'null');
    if (salvo && Date.now() - salvo.em < VALIDADE_MS) return salvo.abertos === true;
  } catch {
    /* armazenamento indisponível: segue sem cache */
  }
  return null;
}

function mostrar(abertos: boolean) {
  document.querySelectorAll<HTMLElement>('[data-link-cursos]').forEach((el) => (el.hidden = !abertos));
}

const cache = cursosConfigurado ? lerCache() : false;
if (!cursosConfigurado) {
  mostrar(false);
} else if (cache !== null) {
  mostrar(cache);
} else {
  turmasAbertas()
    .then((turmas) => {
      const abertos = turmas.length > 0;
      try {
        sessionStorage.setItem(CHAVE, JSON.stringify({ abertos, em: Date.now() }));
      } catch {
        /* ignora */
      }
      mostrar(abertos);
    })
    .catch(() => mostrar(false));
}
