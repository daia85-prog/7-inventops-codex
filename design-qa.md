# Design QA — InventOps Predictive Twin

## Evidências

- Referência aprovada: `reference-approved.png`
- Implementação capturada: `qa/implementation-1.png`
- Comparação lado a lado: `qa/comparison-1.png`
- Viewport e estado: 1440 × 1024, Simulador de Impacto, cenário TITANO preenchido e resultado visível.

## Comparação visual

- **Layout e hierarquia:** sidebar, topbar, cenário, cadeia de impacto, gráfico e recomendação mantêm a mesma ordem, peso e agrupamento da referência.
- **Tipografia e cor:** Sora/Inter, fundo azul profundo, amarelo de ação, ciano preditivo, vermelho de risco e verde de recomendação seguem a direção aprovada.
- **Ícones e imagem:** ícones Phosphor são consistentes; o gêmeo digital usa imagem gerada dedicada, sem ilustração improvisada em CSS/SVG.
- **Responsividade:** há estados dedicados para desktop compacto, tablet e mobile; a navegação principal vira barra inferior no celular.
- **Acessibilidade:** foco visível, controles semânticos, labels em textarea/select, texto alternativo e redução de movimento estão implementados.

## Interações verificadas na implementação

- Simulação com estado de cálculo e retorno do resultado.
- Navegação entre os sete módulos.
- Normalização e reinjeção de falha no Sensor X.
- Criação automática e atualização de status do P0.
- Filtros de alertas, toggles de governança e confirmações de ações executivas.

## Console e build

- Build de produção Vite concluído sem erro.
- Divisão de bundles para gráficos e ícones aplicada; nenhum chunk excede 500 kB.
- Nenhum erro de compilação React/JSX.

## Histórico de correções do QA

1. P1 — gráfico capturado durante animação e aparentando dados incompletos: animação desativada e zona de sobrecarga acima de 100% adicionada.
2. P2 — marca temporária “V” no ícone: corrigida para “IO”.
3. P2 — ações secundárias sem resposta: conectadas a navegação ou confirmação contextual.
4. P2 — ausência de foco e preferência de movimento reduzido: estados de acessibilidade adicionados.
5. P2 — contagem de P0 não refletia alertas resolvidos: indicador e SLA agora reagem ao status.

## Iteração — tabela de Evidências

- Fonte visual: `qa/evidence-bug-reference.png`
- Implementação final: `qa/evidence-fixed-final.png`
- Comparação em uma única imagem: `qa/evidence-fix-comparison.png`
- Viewport e estado: 1876 × 884, tema escuro, página Evidências.
- Evidência focada: a comparação completa também funciona como recorte focado porque a tabela e suas três barras permanecem legíveis lado a lado.
- Interações: navegação direta no desktop/tablet e fluxo Comissionamento → Ver todas as evidências no celular.
- Console: zero erros e zero avisos.

### Achados e correções

1. P1 — a barra usava `position:absolute` sem um contêiner posicionado e atravessava as demais colunas. Correção: trilha própria com largura confinada à célula e preenchimento relativo à trilha.
2. P2 — ao ocultar os textos da sidebar no tablet, os botões perdiam o nome acessível. Correção: `aria-label` preservado em todos os itens de navegação.
3. Pós-correção — desktop: preenchimento termina em 765 px, trilha em 848 px e célula em 895 px; nenhum vazamento. Tablet: página sem overflow horizontal e preenchimento contido. Mobile: corpo com 390 px, tabela rolável internamente e barra contida na célula.

### Superfícies revisadas

- Tipografia: pesos, tamanhos e alinhamento dos percentuais preservados.
- Espaçamento/layout: trilha, percentual e demais colunas não colidem.
- Cores/tokens: amarelo de progresso e trilha azul-acinzentada mantidos.
- Imagens: não há imagens na região corrigida; logo e ícones existentes permanecem inalterados.
- Conteúdo: percentuais e evidências técnicas permanecem integralmente legíveis.

## Iteração — núcleo de Controle de Projetos

- Verdade visual: `reference-approved.png` (sistema visual aprovado do Predictive Twin).
- Implementação desktop: `qa/control-projects/01-portfolio-desktop.png` e `qa/control-projects/02-project-desktop.png`.
- Implementação mobile: `qa/control-projects/03-portfolio-mobile.png` e `qa/control-projects/04-project-mobile.png`.
- Comparação visual: `qa/control-projects/comparison-design-system.png`.
- Viewports: desktop 1440 × 900; mobile 390 × 844.
- Estados: portfólio, criação de projeto, central TITANO, visão geral, plano de trabalho e marcos & riscos.

### Achados e correções

1. P1 — retorno indevido de `window.scrollTo` no efeito provocava erro React no console. Correção: efeito encapsulado sem valor de retorno; nova sessão validada com zero erros e avisos.
2. P2 — tabela operacional exigia rolagem horizontal no celular. Correção: linhas viram cartões de duas colunas; largura do corpo permanece dentro de 390 px.
3. P2 — quarto item da navegação inferior extrapolava o viewport. Correção: itens com `min-width:0`, quatro colunas e nomes acessíveis preservados.
4. P2 — troca de página mantinha a posição de rolagem. Correção: toda navegação reposiciona a nova tela no topo; validado com `scrollY = 0`.
5. P2 — projeto sem bloqueador era apresentado como incidente crítico. Correção: estado “Situação monitorada” com ação adequada para registrar risco.

### Interações e superfícies revisadas

- Cadastro de novo projeto: nome, cliente e responsável; novo item aparece no portfólio e confirmação é exibida.
- Plano de trabalho: inclusão de atividade e mudança de status; contador de concluídas reage imediatamente.
- Navegação: portfólio → projeto → abas → retorno; desktop e mobile.
- Tipografia, espaçamento, tokens, ícones e conteúdo seguem o sistema visual aprovado. Não foram introduzidos novos assets raster; a interface usa a biblioteca Phosphor já adotada.
- Console final: zero erros e zero avisos.

## Resultado final

final result: passed

## Iteração — Requisitos da diretoria

- Identidade: **InventOps**, nome escolhido por Daiana; nenhum rótulo visível “Velo” ou “Radar”.
- Apresentação: `qa/director-requirements/01-presentation-profile.png`.
- Comunicação: `qa/director-requirements/02-communication-center.png`.
- Fluxos verificados: perfil Analista/Gestor/Diretor, Status Report, destinatário corporativo e cinco tarefas vinculadas a e-mail.
- Segurança de comunicação: WhatsApp e Outlook são abertos com conteúdo preparado; o usuário mantém a confirmação final de envio.
- Layout: documento sem overflow horizontal nos estados verificados.
- Build de produção concluído sem erros.

final result: passed

## Iteração — Central Sobreposta e Product Roadmap

- Verdade visual: `reference-approved.png` (sistema visual aprovado do Predictive Twin).
- Central desktop: `qa/project-control-v2/01-modal-desktop.png`.
- Central mobile: `qa/project-control-v2/02-modal-mobile.png` em 390 × 844.
- Roadmap desktop: `qa/roadmap-v1/01-roadmap-desktop.png` em 1280 × 720.
- Estados verificados: ficha técnica, sete fases, 14 áreas, atividades, auditoria, conclusão governada e persistência da sessão.
- Roadmap verificado com cinco eras e filtros de horizonte; sem overflow horizontal do documento.
- Console: zero erros e zero avisos. Build de produção concluído.

### Achados e correções

1. P1 — atividades salvavam a trilha de auditoria anterior. Correção: atualização atômica de atividade, auditoria e persistência.
2. P2 — quinta era ficava parcialmente cortada no notebook de 1280 px. Correção: densidade dos cartões ajustada para exibir a visão anual completa.
3. P2 — modal precisava preservar ação principal no celular. Correção: rodapé fixo com CTA em largura total, sem overflow do corpo.

final result: passed
