# 🗺️ ROADMAP-P7 — Plano de execução e rastreabilidade
### O companheiro do BLUEPRINT: o que vamos construir, em que ordem, como saber que ficou pronto — e o que mudou no caminho

> **Papéis dos documentos:** `BLUEPRINT-P7.md` = visão, conceito e políticas (o QUÊ e o PORQUÊ).
> `ROADMAP-P7.md` (este) = execução: entregas detalhadas, critérios de aceite, status e o
> **registro de mudanças** — pra sempre sabermos por onde começamos, o que mudamos e o que ficou.
> **Ritual:** toda entrega nasce aqui como ⬜, vira ✅ só com critério de aceite batido; toda
> mudança de escopo ganha linha no Registro de Mudanças (§4). Ao fechar cada era: pente-fino
> adversarial + atualizar a coluna "o que ficou".

---

## 1. LINHA DE BASE (v0 — 12/07/2026, o ponto de partida)

O que existe HOJE, herdado do Predictive Twin (verificado por navegação real em 12/07):

**17 telas funcionais:** Login premium · Dashboard Executivo (health score, briefing, "quem o COO
deve cobrar") · Ação · Gerencial · Análise/BI · Relatório Executivo (one-page) · Projetos
(kanban/lista + Central do Projeto + Status Report WhatsApp/Outlook) · Áreas Técnicas · Smart
Triage · Matriz RAID · Simulador de Impacto · Comissionamento (esteira digital) · Sala de
Decisão · Evidências · Administração (RBAC demonstrável) · Apresentação por Perfil ·
Releases & Roadmap · Configurações.

**Dívidas conhecidas da base (o que o transplante corrige):**
- 14 áreas INVENTADAS (COM/TI/DEV/MNT/HML/LOG/SUP/FIN...) com gestores fictícios (Marina, Camila, Juliana, Rafael, Lucas)
- Domínio de e-mail errado no login (`douglas@invent.com.br` → real é `@invent-corp.com`)
- Carteira com 6 projetos (reais no nome/código, dados simulados)
- Tudo em PT-BR só, sem seletor de idioma
- Telas de futuro (Simulador/Comissionamento) sem selo de "visão"
- Sem Cockpit de departamento · sem import Nexus · sem link SharePoint

---

## 2. ERA 1 — "Controle governado" (a demo empresa-inteira) — ENTREGAS DETALHADAS

> Meta: apresentável ao diretor. Ordem de execução = ordem abaixo (cada bloco = commit+push).

### E1.1 · Transplante de realidade ⬜
**O quê:** os 14 departamentos REAIS com gestores reais em todas as telas.
**Fonte da verdade:** `velox-demo/fluxo-data.js` (P1): Comercial/Concept (André Mota) · PMO
(Rodrigo Baruco) · PCP (Weslley Silva/Flavio Moreno) · Compras/Importação (Claudia Duarte/Ana
Carolina) · Eng. Mecânica (Gustavo Pereira) · Eng. Elétrica (Gustavo Pereira) · Produção (Flavio
Moreno) · Montagem (Rojekson Souza) · Infraestrutura (Douglas Alves) · Especificação de Software
(Douglas Alves) · WCS Velox (Marcelo Sanches) · Implantação (Douglas Alves) · PLC (Gustavo
Pereira) · Pós-vendas (Caique Fracaro).
**Onde mexer:** `departments` (FoundationModules.jsx) · `areas` (ProjectControlModal.jsx) ·
referências "TI"/"ENG"/"CMP" em blockers e briefing · e-mail do login → `@invent-corp.com`.
**Aceite:** tela Áreas mostra os 14 reais com gestores reais; ZERO nome fictício de gestor de
área no app; login com domínio certo; narrativa de sobrecarga preservada (Infra/PLC/Compras/
Implantação como áreas quentes).

### E1.2 · Honestidade visual: selos + idiomas ⬜
**O quê:** (a) selo "VISÃO · ROADMAP" nas telas Simulador de Impacto e Comissionamento (+ menção
WCS Velox como visão futura); (b) seletor PT-BR · ES · EN no topo — PT-BR ativo, ES/EN com
"em breve · disponível na próxima versão" ao interagir.
**Aceite:** impossível abrir Simulador/Comissionamento sem ver o selo; seletor visível em
qualquer tela; clicar ES/EN não quebra nada e mostra o aviso.

### E1.3 · Cockpit "Meu Departamento" ⬜ (a construção nova da era)
**O quê:** tela nova no menu OPERAÇÃO. Seletor dos 14 departamentos (Infraestrutura default).
Três colunas: **Minhas entregas** (por projeto, com status e prazo) · **Aguardando de**
(quem/o quê eu espero — interno × cliente) · **Esperam por mim** (a quem devo entrega).
Momento-herói: botão **"Concluir e notificar próxima área"** → carimbo "✓ hoje · HH:MM" +
entrada no **feed de handoffs** ("INF → WCS · Ambiente HML do QUELUZ liberado") + toast de
notificação. Feed de handoffs recentes na base da tela (a "linha do tempo do bastão").
**Aceite:** trocar de departamento troca as 3 colunas; concluir uma entrega gera carimbo+feed+
toast; a cena resolve narrativamente a dor original ("quando a Daiana avisou que a infra do
projeto X ficou pronta?" → está no feed, com hora); acessível por teclado.

### E1.4 · Import Nexus (kickoff → empresa inteira) ⬜
**O quê:** botão "Importar kickoff (Nexus)" em Projetos. Lê `Nexus_Kickoff_*.json` (contrato
verificado: meta + 14 sections + progress + notes). Prévia antes de aplicar (nome, código, %
por seção, nº de pendências por depto). Ao confirmar: cria o projeto E converte cada campo
`tbd` em pendência do departamento dono da seção (aparece no Cockpit).
**Aceite:** importar o arquivo REAL `Nexus_Kickoff_BR_SUPLLY_I26.4018.json` cria o projeto
BR SUPPLY com as pendências de Infraestrutura visíveis no Cockpit INF; importar 2× não duplica.

### E1.5 · Cartão SharePoint (F1) ⬜
**O quê:** na Central do Projeto, cartão "Documentos do projeto" com link pro SharePoint
(`proj-<código>` — padrão do P5) + texto honesto ("os documentos oficiais vivem no SharePoint").
**Aceite:** cartão presente em todo projeto; link abre em nova aba; código do projeto no URL.

### E1.6 · QA + deploy ⬜
**O quê:** ritual completo — clique-a-clique nas 18 telas (17 + Cockpit) com zero erro de
console · teste em 1280×720 (telão) · build · deploy nas camadas (rota no velox-demo.pages.dev
garantida pra amanhã; URL própria na sequência) · passo-a-passo de login no CREDENCIAIS.md.
**Aceite:** selo verde com hash das 3 contas + URLs respondendo 200 + zero console error.

### E1.7 · Kit do vídeo do Igor ⬜ (projeto P1, não P7)
**O quê:** consolidar em UM arquivo: blocos de narração prontos pra ElevenLabs (do
`_VIDEO-IGOR-ROTEIRO-GRAVACAO.md`) + guia de captura tela a tela do velox-demo + **capítulo
final: o InventOps novo como "próximo passo"** + roteiro de bolso de 1 página pro apresentador.
**Aceite:** a Daiana consegue gravar o vídeo inteiro seguindo só esse arquivo, sem perguntar nada.

---

## 3. ERAS SEGUINTES — marcos e critérios de saída (visão de planejamento)

| Era | Janela-alvo* | Entregas-chave | Critério de saída (o portão) |
|---|---|---|---|
| **1 · Controle governado** | 12–13/07/2026 | E1.1 a E1.7 acima | Demo validada pela diretoria (Igor) |
| **1.5 · Fundação técnica** | jul–ago/2026 | TypeScript · Playwright+CI · dados/tema 100% separados · export/backup manual · responsivo mobile | CI verde; nenhum dado hardcoded em componente |
| **2 · Operação conectada** | set–nov/2026 | Supabase + SSO M365 · migração dos dados reais do P1 · ambientes demo/homolog/prod · LGPD · telemetria de adoção · kit de adoção por área | 3 departamentos usando no dia a dia com dados reais |
| **3 · Integrações vivas** | dez/2026–mar/2027 | SharePoint F2/F3 · notificações reais (e-mail/Teams/WhatsApp) · Outlook/Planner · re-import kickoff com diff | Handoff entre 2 áreas 100% pelo sistema (zero WhatsApp) |
| **4 · Inteligência** | 2027 | Simulador calculando sobre histórico real · previsão de gargalo · briefing automático | Previsão com acurácia medida e publicada |
| **5 · Chão de fábrica & Velox** | 2027+ | Telemetria CLP/IoT · passaporte de versões WCS · release notes visíveis · evidência automática do dev | 1 esteira piloto + inventário Velox completo |

_*Janelas honestas: estimativas pra planejar conversa e prioridade, não promessas. Cada era só
abre com a anterior fechada (portão batido) + pente-fino adversarial. Datas se ajustam AQUI,
com linha no §4._

---

## 4. REGISTRO DE MUDANÇAS (começamos → mudamos → ficou)

> A tabela que conta a história do produto. Toda decisão que muda escopo/rumo ganha uma linha.

| Data | Onde | Começamos com… | Mudou para… | Por quê / quem |
|---|---|---|---|---|
| 12/07 | Origem | "Criar um sistema novo do zero pra amanhã" | Promover o Predictive Twin (Codex) a P7 e evoluir | Análise mostrou app completo pronto; construir do zero em 1 dia = risco (Claude propôs, Daiana aprovou) |
| 12/07 | Nome | InventOps "Predictive Twin" | **InventOps** (Predictive Twin = módulo de inteligência) | Daiana: o novo já nasce com o nome oficial |
| 12/07 | Visão §1 | Sem PMO explícito | PMO = coração, no texto e no ecossistema | Daiana (2 achados dela: visão e tabela do hospital) |
| 12/07 | Expectativa | CLP/Simulador apresentados como features | Selo "VISÃO · ROADMAP" obrigatório | Daiana: não gerar expectativa; Claude estendeu ao WCS Velox |
| 12/07 | Idiomas | PT/ES (ideia inicial do Claude) | **PT-BR · ES · EN padrão do produto**, seletor visível já na demo com "em breve" | Daiana: Invent é Comau (público internacional interno) |
| 12/07 | Era 5 | Só telemetria CLP/IoT | + "Fim do Velox a sete chaves" (passaporte de versões, release notes, matriz cliente×versão, evidência do dev) | Daiana (dor real: dev não compartilha) + Claude (4 peças + nota política) |
| 12/07 | Modelos | Fable/Sonnet/Haiku | + Opus 4.8 como reserva estratégica (/fast, limite estourado) | Daiana perguntou "e o Opus?" — lacuna real do Claude |
| 12/07 | Salvamento | Só watchdog 15min + commit por tarefa | **Regra do bloco**: commit+push a cada bloco (~20-30min máx) + diário com "PRÓXIMO" + task list | Daiana: sessão pode acabar a qualquer momento |
| 12/07 | Processo | Confiança na memória do Claude | Regra "NÃO AFIRMAR SEM CONFIRMAR" (CLAUDE.md + memória) | Daiana, após 3 afirmações sem verificação no mesmo dia |
| 12/07 | Docs | Só BLUEPRINT | + ROADMAP-P7 (este) com linha de base e rastreabilidade | Daiana: "comparar por onde começamos, o que mudamos e o que ficou" |

## 5. PLACAR DA ERA 1 (preencher ao fechar — "o que ficou no final")

| Entrega | Planejado (§2) | O que ficou de verdade (12/07, aguardando validação da Daiana) | Desvio? |
|---|---|---|---|
| E1.1 Transplante | 14 deptos+gestores reais, domínio | ✅ Entregue e VERIFICADO no navegador (14 áreas, 10 gestores reais, 0 fictício) + bônus: fix sigla morta `TI` na matriz do modal | Nenhum |
| E1.2 Selos+idiomas | Selo nas 2 telas + seletor | ✅ Selo "✦ VISÃO · ROADMAP" no Simulador e Comissionamento (verificado) + PT/ES/EN na topbar E no login com "em breve" | Nenhum |
| E1.3 Cockpit | 3 colunas + concluir/notificar + feed | ✅ Entregue e verificado ao vivo: toast "WCS Velox notificada ✓ 18:30", feed com carimbo, INF piloto real, demais rotulados exemplo | Nenhum |
| E1.4 Import Nexus | prévia, tbd→pendências, sem dup | ✅ Testado com o kickoff REAL do BR SUPPLY: prévia "23 pendências → WCS 8 · EMC 5 · ESP 1 · INF 9", re-import não duplica, 9 no Cockpit INF com tag "Kickoff Nexus" | Bônus: exemplo servido em `/exemplos/` p/ demo ao vivo |
| E1.5 SharePoint F1 | cartão + link | ✅ Cartão na Central do Projeto (`proj-i26.4018.aspx`) | ⚠️ BASE da URL a confirmar pela Daiana (constante única) |
| E1.6 QA+deploy | 0 console errors + rota garantida | ✅ QA funcional completo (0 erros) + **NO AR: velox-demo.pages.dev/inventops/ (HTTP 200)** | URL própria (Pages novo do repo 7-inventops) fica pós-apresentação; teste 720p pendente de olho humano |
| E1.7 Kit vídeo | arquivo único | ✅ `P1/_KIT-VIDEO-IGOR.md`: 5 blocos narrados (ElevenLabs) + capítulo novo do InventOps + roteiro de bolso + checklist | Nenhum |

---

## 6. TRILHA CODEX PÓS-BASELINE

| Release | Entrega | Critério de aceite | Estado |
|---|---|---|---|
| V17.6 | Entregas por Área | 14 áreas com responsável, prazo, evidência, dependência e handoff dentro de cada projeto | ✅ Build + jornada visual validados |
| V17.7 | Central PMO | Carteira consolidada, cobrança rastreável e abertura contextual do projeto | ✅ Filtro, atualização de indicador, vínculo com projeto e console validados |
| V17.8 | Plano Integrado | 42 atividades por projeto, criação governada e conclusão somente com evidência | ✅ Criação, bloqueio sem evidência, filtro de dependência e console validados |
| V17.9 | Fases & Gates | Sete gates formais, critérios de saída e avanço somente após aprovação do PMO | ✅ Bloqueio de avanço, prontidão e registro de evidência validados |

---

_Criado 12/07/2026 · vive junto do BLUEPRINT-P7.md · toda entrega ⬜→✅ só com aceite batido._
