// Política de Privacidade publicada pelo Instituto no site anterior
// (texto oficial, mantido). A seção sobre os cursos foi acrescentada para o
// módulo de inscrições (docs/CURSOS.md).
export type SecaoPrivacidade = { titulo: string; paragrafos?: string[]; lista?: string[]; depois?: string[] };

export const secoesPrivacidade: SecaoPrivacidade[] = [
  {
    titulo: '1. Quem somos',
    paragrafos: [
      'O Instituto Costa da Mina é uma organização dedicada ao desenvolvimento de iniciativas sociais, culturais e comunitárias, promovendo ações voltadas à valorização da identidade, da cultura, da ancestralidade, da inclusão e do fortalecimento da comunidade.',
      'Entre suas iniciativas estão projetos como o Trança Amiga, o Beco da Mina, o Sarau Trançado e o Trançando o Futuro.',
      'Para os fins da legislação aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais (LGPD), o Instituto Costa da Mina é responsável pelo tratamento dos dados pessoais realizado no âmbito de suas atividades, observadas as particularidades de cada situação.',
    ],
  },
  {
    titulo: '2. Quais dados podemos coletar',
    paragrafos: ['Dependendo da forma como você interage conosco, podemos coletar informações como:'],
    lista: [
      'Nome;',
      'E-mail;',
      'Número de telefone ou WhatsApp;',
      'Informações fornecidas voluntariamente em formulários de contato;',
      'Informações relacionadas à participação em projetos, eventos ou atividades do Instituto;',
      'Dados necessários para responder a solicitações, inscrições ou contatos;',
      'Informações técnicas de navegação, como endereço IP, tipo de dispositivo, navegador e páginas acessadas, quando aplicável.',
    ],
    depois: ['O Instituto busca coletar apenas os dados necessários para a finalidade para a qual foram fornecidos.'],
  },
  {
    titulo: '3. Como utilizamos seus dados',
    paragrafos: ['Os dados pessoais poderão ser utilizados para:'],
    lista: [
      'Responder mensagens, dúvidas e solicitações;',
      'Realizar inscrições ou organizar a participação em projetos e atividades;',
      'Entrar em contato com participantes, parceiros e interessados;',
      'Divulgar informações relacionadas às atividades e projetos do Instituto, quando autorizado ou permitido pela legislação;',
      'Melhorar a experiência de navegação e funcionamento do site;',
      'Cumprir obrigações legais ou regulatórias;',
      'Exercer direitos e defender interesses legítimos do Instituto;',
      'Prevenir fraudes, abusos e usos indevidos de nossos canais;',
      'Outras finalidades compatíveis com aquelas informadas no momento da coleta.',
    ],
  },
  {
    titulo: '4. Compartilhamento de dados',
    paragrafos: [
      'O Instituto Costa da Mina não comercializa dados pessoais.',
      'Quando necessário para a realização de suas atividades, os dados poderão ser compartilhados com prestadores de serviços, parceiros ou fornecedores que auxiliem na operação do site, comunicação, organização de projetos ou execução de atividades institucionais.',
      'Nessas situações, buscamos adotar medidas para que os dados sejam tratados de maneira segura e de acordo com a legislação aplicável.',
      'Os dados também poderão ser compartilhados quando houver obrigação legal, determinação de autoridade competente ou necessidade de exercício e defesa de direitos.',
    ],
  },
  {
    titulo: '5. Cookies e tecnologias semelhantes',
    paragrafos: [
      'Nosso site poderá utilizar cookies e tecnologias semelhantes para garantir seu funcionamento adequado, compreender como os visitantes utilizam nossas páginas e, quando aplicável, melhorar a experiência de navegação.',
      'Cookies são pequenos arquivos armazenados no dispositivo do usuário durante a navegação.',
      'Você pode configurar seu navegador para bloquear ou excluir cookies. Entretanto, algumas funcionalidades do site podem não funcionar corretamente caso determinados cookies sejam desativados.',
    ],
  },
  {
    titulo: '6. Segurança das informações',
    paragrafos: [
      'O Instituto Costa da Mina adota medidas técnicas e organizacionais razoáveis para proteger os dados pessoais contra acessos não autorizados, perda, destruição, alteração, divulgação ou qualquer outra forma de tratamento inadequado ou ilícito.',
      'Apesar dos esforços empregados, nenhum sistema eletrônico é completamente seguro. Por isso, também recomendamos que os usuários adotem boas práticas de segurança ao utilizar a internet e nossos canais de comunicação.',
    ],
  },
  {
    titulo: '7. Armazenamento e retenção dos dados',
    paragrafos: [
      'Os dados pessoais serão armazenados pelo período necessário para cumprir as finalidades para as quais foram coletados, atender obrigações legais ou regulatórias e possibilitar o exercício regular de direitos.',
      'Quando não houver mais necessidade de manutenção dos dados, eles poderão ser eliminados ou anonimizados, observadas as hipóteses legais que autorizem ou exijam sua conservação.',
    ],
  },
  {
    titulo: '8. Direitos dos titulares',
    paragrafos: ['Nos termos da LGPD, você poderá exercer, quando aplicável, direitos relacionados aos seus dados pessoais, incluindo:'],
    lista: [
      'Confirmação da existência de tratamento;',
      'Acesso aos dados pessoais;',
      'Correção de dados incompletos, inexatos ou desatualizados;',
      'Solicitação de anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a legislação;',
      'Portabilidade dos dados, quando regulamentada e aplicável;',
      'Informação sobre compartilhamentos realizados;',
      'Revogação do consentimento, quando o tratamento estiver baseado nessa hipótese;',
      'Informação sobre as consequências da negativa de consentimento;',
      'Oposição a determinados tratamentos, nos casos previstos pela legislação.',
    ],
    depois: [
      'As solicitações serão analisadas de acordo com a legislação vigente e poderão estar sujeitas a procedimentos de confirmação de identidade para proteção do próprio titular.',
    ],
  },
  {
    titulo: '9. Dados de crianças e adolescentes',
    paragrafos: [
      'O Instituto Costa da Mina reconhece a importância da proteção da privacidade de crianças e adolescentes.',
      'Quando houver coleta ou tratamento de dados pessoais de crianças ou adolescentes no contexto de projetos, atividades ou ações institucionais, serão observadas as disposições da LGPD e demais normas aplicáveis, sempre buscando preservar seu melhor interesse e sua segurança.',
    ],
  },
  {
    titulo: '10. Links para outros sites',
    paragrafos: [
      'Nosso site poderá apresentar links para páginas ou serviços de terceiros.',
      'O Instituto Costa da Mina não é responsável pelas práticas de privacidade, segurança ou conteúdo desses sites. Recomendamos que o usuário consulte as respectivas políticas de privacidade antes de fornecer seus dados pessoais.',
    ],
  },
  {
    titulo: '11. Alterações nesta Política de Privacidade',
    paragrafos: [
      'Esta Política de Privacidade poderá ser atualizada periodicamente para refletir mudanças em nossas atividades, nos serviços oferecidos pelo site ou na legislação aplicável.',
      'A versão mais recente estará sempre disponível nesta página, acompanhada da respectiva data de atualização.',
    ],
  },
];
