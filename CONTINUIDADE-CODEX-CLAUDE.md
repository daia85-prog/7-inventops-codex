# Continuidade operacional — Codex ↔ Claude

Atualizado em: 9 de agosto de 2026

## 1. Linha principal oficial

- P7 / Codex = produto oficial
- P9 / Claude = laboratório, validação, crítica técnica, referência de UX e apoio de arquitetura

Regra: nenhuma evolução paralela deve criar uma segunda verdade do produto.

## 2. Referência oficial desta fase

- `inventops79` passa a ser a referência principal de nível premium
- o P7 atual continua sendo a base funcional real do produto
- regra de trabalho:
  - comparar tela por tela
  - absorver o que `inventops79` tiver de melhor
  - trazer para o P7 tudo o que existir lá e ainda não existir aqui
  - preservar no P7 o que já estiver mais funcional, mais confiável ou mais maduro

Resumo da linha:

- `inventops79` = régua visual + régua funcional de referência
- `P7 atual` = produto real em evolução contínua
- nada de manter o P7 como “demo”; a partir desta fase a linguagem, a navegação e a experiência devem refletir produto real

## 3. Prioridade atual

Foco imediato:

1. Login
2. Carregamento / transição
3. Home
4. Operação Assistida Daniel + Thomas
5. Administração
6. Implantação
7. DevOps / Especificação de Software

Objetivo:

- deixar pronto para teste com áreas reais
- subir o nível premium com base em `inventops79`
- manter tudo funcional
- garantir PT / ES / EN
- permitir uso real já na próxima semana com os perfis e áreas em operação assistida

Bloco crítico incorporado:

- `cockpit-piloto` do `inventops79` entra na análise oficial como referência funcional para Daniel + Thomas
- decisão de produto: só manter o termo “Cockpit” se ele virar um padrão permanente para todos os departamentos; caso contrário, adaptar para “Operação Assistida”, “Meu Departamento” ou “Esteira Operacional”
- Daniel e Thomas devem aparecer como usuários reais de área, não como “demo” nem “piloto visual”

## 4. Regra de execução

- Uma tela por vez
- Só seguir para a próxima quando a atual estiver funcional
- Visual bonito não conta sozinho
- Referência obrigatória: antes de refinar a tela atual, comparar com `inventops79`
- Todo avanço deve ser:
  - funcional
  - demonstrável
  - coerente com a navegação
  - trilíngue

Checklist de comparação por tela:

- o que existe em `inventops79` e ainda falta no P7?
- o que em `inventops79` está visualmente melhor resolvido?
- o que no P7 atual já funciona melhor e deve ser preservado?
- o que precisa ser redesenhado, e não apenas “lapidado”?

## 5. Regra de produto

Toda entrega deve partir do princípio de produto real.

Regra nova:

- não chamar mais o P7 principal de demo
- textos, rótulos e narrativa principal devem refletir produto operacional
- se um módulo ainda for visão futura, chamar de expansão / roadmap / próxima camada do produto
- nunca vender conceito como se já estivesse integrado
- nunca rebaixar o que já é produto real chamando de “simulado” sem necessidade

## 6. Regra de continuidade quando um lado parar

Quem parar deixa registrado:

- o que foi concluído
- o que ficou pela metade
- arquivos alterados
- próximo passo recomendado
- risco conhecido

Quem continuar:

- não reabre a estratégia do zero
- não troca a linha principal
- não cria uma nova arquitetura paralela
- continua do ponto mais próximo do fluxo atual

## 7. Regra de convergência

Tudo que vier do Claude ou de outra referência externa entra em 3 grupos:

### Entra já

- melhora produto atual
- não quebra arquitetura
- cabe no fluxo atual

### Entra depois

- é bom, mas depende de base técnica ainda não pronta

### Não entra

- cria segunda verdade
- aumenta complexidade sem ganho imediato
- compete com a linha principal

## 8. Rastro atual — 9 de agosto de 2026

Decisão mais recente da Daiana:

- o P7 não deve mais ser tratado como demo;
- a referência `inventops79` pode redesenhar o P7 tela por tela, inclusive substituindo o que já existe se ficar melhor;
- Daniel e Thomas devem entrar como usuários reais das áreas;
- “Cockpit” só deve permanecer se virar padrão de produto para todos os departamentos;
- se não for padrão amplo, usar linguagem de produto: Operação Assistida, Meu Departamento, Esteira Operacional ou Painel da Área;
- prioridade de entrega: Login → Carregamento → Home → Operação Assistida Daniel/Thomas → Administração → Implantação → Especificação/DevOps.

Implementado nesta rodada:

- navegação principal renomeada para “Operação Assistida”;
- page meta da rota de departamento ajustada para esteira real de área;
- Daniel e Thomas entram como usuários reais das áreas, e o acesso administrativo passa a ser Admin InventOps;
- textos visíveis deixaram de falar “piloto visual” e passaram a falar operação assistida, projeto operacional e checklist do Planner;
- login passa a falar “perfis corporativos”, não acesso de demonstração.

Pendente intencional:

- órbita de departamentos do login ainda corta alguns nomes em alguns tamanhos de tela. Não bloquear o avanço funcional por isso. Quando voltar ao acabamento final, redesenhar a órbita ou pedir apoio do Claude.

Se o crédito do Codex acabar:

1. Claude deve continuar pela experiência de produto real, não por demo.
2. Primeiro validar a Operação Assistida Daniel/Thomas:
   - Daniel abre Implantação;
   - Thomas abre Especificação/DevOps;
   - ações de concluir checkpoint, cobrar, sinalizar prontidão e confirmar handoff funcionam;
   - textos não usam “piloto” como produto final.
3. Depois consolidar Administração:
   - perfis Admin, Direx, Gestor e Analista;
   - abrir contexto correto por usuário;
   - esconder controles que poluem a sidebar se já estiverem em Administração.
4. Em seguida comparar cada tela com `inventops79` e aplicar o que estiver melhor, mantendo o P7 como produto oficial.

## 8. Ordem técnica realista

Enquanto elevamos o piloto visual e funcional:

- manter React + Vite como experiência principal
- preparar backend real por contratos
- separar claramente expansão futura do que já está em operação real
- fechar auditoria, tenant e permissões fora da interface

## 9. Meta desta fase

Transformar o InventOps de:

- base funcional ainda desigual

para:

- núcleo operacional confiável, bonito, funcional, premium e pronto para piloto controlado

com esta ordem:

- Login 100%
- Home 100%
- Administração 100%
- áreas piloto 100%
- depois expansão para os demais departamentos

## 10. O que o Claude deve assumir ao continuar amanhã

- seguir a mesma ordem de telas e módulos
- usar `inventops79` como referência obrigatória
- ajudar a trazer para o P7:
  - componentes
  - lógicas
  - experiências
  - comportamentos
  - leitura premium
- não abrir linha paralela de produto
- registrar qualquer melhoria em um destes grupos:
  - entra já
  - entra depois
  - precisa validar com Daia
  - precisa consolidar no P7

## 11. Registro obrigatório de posição atual + próximo passo

Sempre que o Codex parar, encerrar sessão ou ficar sem créditos, deve deixar registrado:

- onde está exatamente no fluxo
- o que acabou de concluir
- o que está em andamento
- o próximo passo imediato
- o próximo passo estrutural
- o que pode ser feito pelo Claude sem esperar
- o que deve voltar para o Codex depois

Formato obrigatório:

### Estado atual do P7
- Data:
- Bloco atual:
- Última entrega concluída:
- Em andamento agora:
- Próximo passo imediato:
- Próximo passo estrutural:
- Riscos / travas:

### Se o crédito do Codex acabar agora
Claude deve:
1.
2.
3.

### Depois que o Claude terminar
Voltar para o Codex com:
1.
2.
3.

## 12. Protocolo de continuidade entre créditos

Objetivo: impedir retrabalho e permitir que Claude avance com autonomia útil enquanto o Codex estiver parado.

Regras:

- Claude não deve tentar “reinventar” a linha principal.
- Claude deve primeiro estruturar, revisar, organizar e preparar terreno.
- Claude pode:
  - analisar `inventops79` em profundidade
  - mapear tela por tela o que precisa entrar no P7
  - reorganizar backlog e prioridades
  - registrar melhorias visuais/funcionais por módulo
  - atacar pontos pendentes claramente documentados
  - propor refinamentos para Home, Administração, perfis e departamentos piloto
- Claude não deve:
  - trocar arquitetura principal
  - abrir produto paralelo
  - mudar contrato de domínio congelado

## 13. Handoff operacional padrão

Se o crédito do Codex acabar, o Claude deve seguir nesta ordem:

1. Revisar 100% do `inventops79`
2. Produzir mapa: `inventops79` x `P7 atual`
3. Separar por grupos:
   - já existe e está bom
   - existe mas precisa redesenhar
   - existe no `inventops79` e falta no P7
   - existe no P7 mas precisa reorganizar
4. Estruturar a base para:
   - Login
   - Carregamento
   - Home
   - Administração
   - Implantação
   - Especificação / DevOps
5. Registrar claramente o que ele fez e o que devolve para o Codex implementar / consolidar

Depois disso, quando o Codex voltar, a retomada deve ser:

1. consolidar no P7 o que o Claude estruturou
2. validar funcionalidade real
3. publicar
4. seguir para o próximo bloco sem reabrir discussão antiga

## 14. Frase-guia

Não ganhar por quantidade de telas.

Ganhar por clareza, confiança, evidência e continuidade.
## 2026-08-09 - Regra de absorcao inventops79 para Operação Assistida

Estado atual: P7 e a linha principal. `inventops79` virou referencia forte de produto, principalmente para as areas que vao testar primeiro: Implantacao/Daniel e Especificacao-DevOps/Thomas.

Diretriz obrigatoria: não trazer como "demo" nem como enfeite. Tudo que veio de `inventops79` precisa entrar como comportamento de produto:

- passagem de bastao com checklist e confirmacao;
- sinalizar prontidao para a próxima area;
- registrar cobranca quando uma dependencia travar o fluxo;
- histórico/linha do tempo por acao relevante;
- chat operacional/contexto ligado a area e ao histórico;
- copia de resumo da esteira para alinhamento;
- Thomas e Daniel como usuários reais de validação inicial;
- termos de produto real: evitar "demo" e evitar "cockpit piloto" se não for modulo permanente.

Aplicado neste bloco: a Operação Assistida recebeu chat operacional e as acoes principais passaram a alimentar histórico/chat: concluir entrega, copiar resumo, registrar cobranca, sinalizar prontidao, concluir checkpoint e confirmar handoff.

Se o credito do Codex acabar: Claude deve validar a Operação Assistida contra esta lista antes de continuar novos modulos. Prioridade de validação: Daniel/Thomas conseguem abrir suas areas, registrar cobranca/prontidao, concluir checkpoints e enxergar o histórico resultante.

## 2026-08-09 - Rastro atual do Codex para continuidade P7/P9

Estado do bloco atual:

- P7 continua como linha principal do produto.
- `inventops79` passa a ser referencia visual e funcional obrigatoria para reorganizar o P7 tela por tela.
- A regra agora e produto real: não chamar de demo, não maquiar, não manter telas apenas apresentaveis.
- Se uma tela precisar ser reescrita para virar produto de verdade, pode reescrever.
- Home, Administração, Operação Assistida, Implantacao e Especificacao/DevOps sao prioridade por causa dos testes com usuários.

Aplicado pelo Codex neste bloco:

- Home deixou de usar "Fluxo Principal" e passou a usar "Jornada Operacional".
- Portfolio deixou de usar "Portfolio Demo" e passou a usar "Carteira Operacional".
- Areas deixaram de usar "Foco de Teste" e passaram a usar "Area Prioritaria".
- Operação Assistida abre por padrao em Implantacao/Daniel, porque Daniel e Thomas sao os primeiros validadores reais.

Pendente consciente:

- Login ainda tem pendencia visual na orbita de departamentos: alguns nomes podem cortar em certas larguras.
- Nao bloquear a evolucao por isso; registrar e pedir ajuda do Claude depois, se necessario.
- Fazer uma revisao visual fina posterior com foco em login/orbita, sem desviar do objetivo de produto funcional.

Se o credito do Codex acabar agora, Claude deve:

1. Nao abrir arquitetura nova.
2. Usar `inventops79` como referencia principal.
3. Mapear tela por tela:
   - Login
   - Carregamento
   - Home
   - Administração
   - Operação Assistida
   - Implantacao
   - Especificacao/DevOps
4. Validar paridade funcional com `inventops79`, especialmente:
   - passagem de bastao
   - sinalizar prontidao
   - histórico por acao
   - chat/contexto da area
   - Daniel e Thomas como usuários reais
5. Registrar no mesmo formato: o que fez, o que falta, o que o Codex deve consolidar quando voltar.

Quando o Codex voltar:

1. Ler este arquivo antes de mexer em codigo.
2. Ler tambem `PENDENCIAS-P7-P9.md`.
3. Consolidar o que Claude adiantou no P7.
4. Rodar build.
5. Publicar.
6. Só então seguir para o proximo modulo.

## 2026-08-09 - Avanco funcional: gate de aceite na Operação Assistida

Aplicado no P7:

- A esteira operacional agora tem um `GATE DE ACEITE` visivel por projeto.
- O handoff confirmado registra estado aceito, horario, chat e linha do tempo.
- Antes do aceite final, Daniel/Thomas podem usar `Solicitar ajuste`.
- Solicitar ajuste registra motivo, alimenta chat operacional e linha do tempo.
- Isso reforca o Principio 12: exibido não significa aplicado.

Por que isso existe:

- Em `inventops79`, a passagem de bastao não era apenas visual; ela precisava ser controlada.
- Agora o P7 comeca a reproduzir esse comportamento como produto real.

Pendente para validar:

- Abrir Operação Assistida como Daniel/Implantacao.
- Concluir checkpoints ate liberar handoff.
- Confirmar handoff e conferir chat/histórico.
- Em outro projeto, solicitar ajuste e conferir que o aceite não e concluido.

## 2026-08-09 - Home e Administração conectadas ao fluxo real

Aplicado no P7:

- Home passou a mostrar `Bastoes em movimento` em PT/ES/EN.
- Os cards de bastao apontam para Implantacao/Daniel e Especificacao-DevOps/Thomas.
- Cada bastao mostra projeto, responsavel, estado e próxima leitura operacional.
- Administração passou a mostrar para cada usuário valido:
  - Gate atual;
  - Ultima acao;
  - Proxima acao esperada.
- Daniel e Thomas deixam de ser apenas nomes de teste e passam a aparecer como usuários operacionais com contexto.
- O botao `Validar usuário` na Administração agora altera estado real do usuário, grava horario e define próxima acao.
- Login teve as sobras internas de `demo/perfis disponiveis` removidas para evitar regressao visual ou conceitual.

Por que isso existe:

- O usuário precisa entender na Home onde agir sem depender de explicacao externa.
- Administração precisa governar usuário e capacidade, não apenas cadastrar perfil.
- O P7 deve absorver o que o `inventops79` ja tinha de bom em passagem de bastao, histórico e acao por area.

Pendente para validar:

- Abrir Home em PT/ES/EN e confirmar que os bastoes traduzem corretamente.
- Clicar em cada bastao e confirmar abertura da Operação Assistida na area correta.
- Abrir Administração e clicar em Daniel/Thomas para confirmar contexto correto.
- Clicar em `Validar usuário` e confirmar troca de status/gate/ultima acao/próxima acao.
- Ajustar visual se a nova seção ocupar espaco demais em telas menores.

## 2026-08-09 - Bloqueio crítico: qualidade de texto e produto real

Daia apontou um problema que bloqueia apresentação: textos quebrados por encoding/mojibake no menu e em telas internas, exemplo `Minha OperaÃ§Ã£o`, `AnÃ¡lise / BI`, `RelatÃ³rio Executivo`.

Status aplicado pelo Codex:

- Corrigidos textos visíveis do menu principal no P7.
- Corrigido bloco antigo do Roadmap com dupla codificação.
- Criada trava automática em `tools/check-text-quality.cjs`.
- Criado documento `QUALIDADE-TEXTO-I18N.md`.

Antes de continuar Daniel/Thomas ou qualquer nova tela, Claude deve:

1. Rodar `node tools/check-text-quality.cjs`.
2. Fazer pente-fino visual em janela limpa de:
   - Login;
   - Carregamento;
   - Home;
   - Administração;
   - Operação Assistida;
   - Implantação/Daniel;
   - Especificação-DevOps/Thomas.
3. Remover narrativa visível de demo/protótipo/mockup/dados ilustrativos.
4. Corrigir textos PT/ES/EN quando mexer em qualquer tela.
5. Registrar toda dificuldade visual que não conseguir resolver.

Autonomia de Claude:

- Pode corrigir textos, layout, navegação e leitura das telas.
- Pode usar `inventops79` como referência principal e redesenhar partes do P7 quando isso melhorar o produto.
- Não deve abrir arquitetura nova nem criar linha paralela.
- Deve priorizar produto real para Daniel/Thomas e Administração, não lapidação superficial.

## 2026-08-09 - Mudança de estratégia: antes de evoluir, endurecer o código

Daia pediu explicitamente parar de tropeçar em problemas antigos antes de continuar expandindo telas.

Novo documento guia criado:

- `CODE-HEALTH-PLANO-CONTINUIDADE.md`

Se o crédito do Codex acabar, Claude deve seguir este plano antes de implementar novas telas:

1. Rodar checagens.
2. Revisar código crítico.
3. Corrigir texto/i18n/código velho.
4. Registrar ponto de parada.
5. Só então continuar Daniel/Thomas, Administração e Home.

Regra nova:

> Não avançar funcionalidade nova se a base ainda estiver gerando texto quebrado, navegação confusa ou regressão visual fácil.

## 2026-08-09 - Code health Bloco B iniciado: shell/navegação

Aplicado pelo Codex:

- Removida a Sidebar antiga que não era mais usada, mas ainda continha controles legados de tema/perfil.
- Jornada interna renomeada de demo para produto (`ProductJourneyRail`).
- Classes CSS da jornada renomeadas para `product-journey-*`.
- Corrigidos textos do Topbar que ainda tinham `?` no lugar de acentos.
- Trava `tools/check-text-quality.cjs` ampliada para detectar fragmentos como `m?dulo`, `expans?o`, `usu?rio`, `opera??o`.

Validação:

- `node tools/check-text-quality.cjs` passou.
- `pnpm build` passou.

Próximo ponto se Claude continuar:

1. Validar visualmente a lateral em janela limpa.
2. Confirmar que perfis/temas ficam concentrados em Administração, não na lateral.
3. Continuar saneamento de Home/Admin/Operação Assistida antes de novas features.
## 2026-08-09 - Code health Bloco B.1: limpeza de linguagem antiga no login

Aplicado pelo Codex:

- Classes antigas `demo-credentials` renomeadas para `corporate-credentials`.
- Mantida a decisão de produto real: nada visível deve sugerir demo, protótipo ou mockup.
- Confirmado que o próximo foco continua sendo saneamento antes de novas telas: Home, Administração e Operação Assistida Daniel/Thomas.

Validação:

- `node tools/check-text-quality.cjs` deve passar antes de qualquer novo bloco.
- `pnpm build` deve passar antes de publicar.

Próximo ponto se Claude continuar:

1. Rodar a trava de texto e o build.
2. Fazer varredura visual em janela limpa.
3. Priorizar correção de texto/código antigo antes de aprofundar Daniel/Thomas.
4. Só depois retomar o fluxo funcional: histórico, chat, passagem de bastão, aceite/devolução e leitura por área.

## 2026-08-09 - Code health Bloco B.2: remover usuário de teste do login

Aplicado pelo Codex:

- Login deixou de iniciar com `admin.teste@invent-corp.com`.
- SSO corporativo agora entra com `daniel.almeida@invent-corp.com`, alinhado ao fluxo real de Implantação/Daniel.
- Trava de qualidade ampliada para bloquear retorno de:
  - `admin.teste`;
  - `douglas.alves`;
  - `daiana soares`;
  - `demo-credentials`;
  - `demo-journey`.

Validação:

- `node tools/check-text-quality.cjs` passou.
- `pnpm build` passou.

Próximo ponto se Claude continuar:

1. Validar visualmente login em janela limpa.
2. Confirmar que a entrada do sistema não mostra usuários antigos, demo ou métricas de demonstração.
3. Se necessário, trocar o acesso padrão para Thomas quando a próxima validação for Especificação/DevOps.
4. Seguir para Home/Admin/Operação Assistida com Daniel e Thomas como produto real.

## 2026-08-09 - Code health Bloco B.3: lateral mais compacta

Aplicado pelo Codex:

- Lateral principal compactada em telas desktop.
- Menu por módulos preservado.
- Controles de perfil/tema continuam fora da lateral principal; Administração deve concentrar governança de usuário.
- Objetivo: ganhar área útil sem voltar ao menu cortado/ilegível.

Validação esperada:

- Abrir em janela limpa.
- Confirmar que os nomes do menu cabem.
- Confirmar que o menu segue por módulos recolhíveis.
- Confirmar que a lateral não volta a ocupar espaço exagerado.

Se Claude continuar:

1. Fazer ajuste fino visual da lateral somente se houver corte real.
2. Não reintroduzir seletores de perfil/tema na lateral.
3. Manter Administração como local oficial para perfis, usuários, tema e capacidades.

## 2026-08-09 - Code health Bloco B.4: login contextual por usuário

Aplicado pelo Codex:

- O login deixou de abrir sempre como Admin genérico.
- `daniel.almeida@invent-corp.com` agora cria sessão como Gestor da área de Implantação (`dept: IMP`).
- `thomas.santos@invent-corp.com` agora cria sessão como Analista da área de Especificação/DevOps (`dept: ESP`).
- `admin@invent-corp.com` permanece como perfil Admin.
- Topbar e lateral passam a mostrar o usuário da sessão, em vez de repetir Admin para todos.
- A sessão salva `inventops-user` no navegador para manter nome, iniciais, perfil e área.

Validação:

- `node tools/check-text-quality.cjs` passou.
- `pnpm build` passou.

Se Claude continuar:

1. Validar visualmente login com Daniel e Thomas em janela limpa.
2. Confirmar que a navegação respeita perfil: Gestor/Analista/Admin.
3. Se o fluxo Daniel/Thomas for aprofundado, manter essa sessão como fonte de contexto para Operação Assistida.
4. Próximo bloco recomendado: ligar Home -> Bastões em movimento -> Operação Assistida com filtros reais por Daniel/Thomas.

## 2026-08-09 - Code health Bloco B.5: Home conecta sessão à Operação Assistida

Aplicado pelo Codex:

- A página de Operação Assistida agora recebe `currentUser`.
- Ao abrir Daniel/Thomas a partir da Home, o componente é remontado por `cockpitDept`, evitando herdar estado visual do departamento anterior.
- A faixa da Operação Assistida mostra a sessão ativa junto do ponto focal da área.
- Mantida a lógica atual de handoff, chat, cobrança, aceite/devolução e histórico.

Validação:

- `node tools/check-text-quality.cjs` passou.
- `pnpm build` passou.

Se Claude continuar:

1. Validar o fluxo em navegador limpo:
   - login Daniel -> Home -> Bastões em movimento -> Implantação;
   - login Thomas -> Home -> Bastões em movimento -> Especificação/DevOps.
2. Conferir se as ações da Operação Assistida continuam funcionando:
   - concluir checkpoint;
   - cobrar pendência;
   - sinalizar prontidão;
   - aceitar/devolver handoff;
   - registrar mensagem no histórico.
3. Próximo bloco recomendado: criar teste automatizado leve cobrindo clique Home -> Operação Assistida para IMP/ESP.
