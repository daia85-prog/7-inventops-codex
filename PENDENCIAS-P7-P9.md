# Pendências P7 ↔ P9

## Diretriz ativa desta fase

- `inventops79` é a referência principal de evolução visual e funcional
- o P7 atual é a base funcional real
- tudo que existir lá e agregar valor deve ser avaliado para incorporação no P7
- o objetivo não é apenas polir o P7 atual; é redesenhar onde necessário para subir o produto de verdade

## Login — órbita de departamentos

- Status: pendente para ajuste fino posterior
- Contexto: a tela de login evoluiu, mas ainda existe corte visual em alguns nomes da órbita, principalmente:
  - Pós-vendas
  - Eng. Elétrica
- Observação: a base visual atual está funcional e publicada. O ajuste restante é especificamente de composição/layout da órbita, sem bloquear o restante do fluxo.
- Próximo passo sugerido:
  - revisar estratégia de distribuição das bolhas
  - validar com apoio do Claude se necessário
  - só depois voltar ao polimento premium final do login

## Home / Administração / áreas em operação assistida

- Status: prioridade funcional imediata
- Contexto:
  - a usuária sinalizou que não quer mais somente lapidação visual
  - quer funcionamento real para mostrar ao time
  - Login, Home, Administração e áreas em operação assistida precisam ser tratados como produto real
- Regra:
  - primeiro trazer e consolidar o que `inventops79` já possui dessas áreas
  - depois agregar melhorias novas
- Próximo passo sugerido:
  - validar navegação real por perfil
  - abrir corretamente Daniel / Thomas / Admin InventOps
  - garantir leitura e ação nas áreas de Implantação e Especificação/DevOps

## Operação Assistida Daniel + Thomas

- Status: entra agora como prioridade de análise e incorporação
- Referência:
  - `https://velox-demo.pages.dev/inventops79/cockpit-piloto/`
- Leitura:
  - a ideia foi aprovada como forte pelo produto
  - não deve ficar restrita a “piloto” visual
  - só manter o termo “Cockpit” se isso virar um padrão permanente para todos os departamentos
  - se não for padrão amplo, adaptar para “Operação Assistida”, “Meu Departamento” ou “Esteira Operacional”
  - deve virar módulo real das áreas focais
- Objetivo:
  - conectar Daniel / Implantação
  - conectar Thomas / Especificação / DevOps
  - mostrar esteira, handoff, projeto, responsável e status em uma mesma camada operacional
- Próximo passo sugerido:
  - incluir essa experiência no mapa oficial `inventops79` x `P7`
  - avaliar como ele conversa com Home + Administração + DepartmentCockpit atual
  - transformar a ideia em módulo real do P7

## Estado atual do P7 — 9 de agosto de 2026

- Bloco atual: transição de “demo/apresentação” para produto real
- Última entrega concluída:
  - remoção de linguagem principal de demo
  - centralização de perfis/temas em Administração
  - substituição do acesso legado por “Admin InventOps”
  - alinhamento documental P7 ↔ P9 com `inventops79` como referência oficial
- Em andamento agora:
  - reorganizar o sistema com base no `inventops79`
  - sair de lapidação superficial e entrar em funcionalidade real
- Próximo passo imediato:
  - estruturar Home + Administração + acessos dos perfis reais
  - abrir corretamente Daniel / Thomas / Admin InventOps nos contextos de operação assistida
- Próximo passo estrutural:
  - fazer análise 100% do `inventops79`
  - produzir equivalência tela por tela com o P7
  - decidir o que entra, o que substitui e o que permanece
- Riscos / travas:
  - login ainda tem pendência visual na órbita dos departamentos
  - algumas áreas ainda estão mais “apresentáveis” do que realmente operacionais
  - risco de retrabalho se seguir refinando sem mapa completo do `inventops79`

## Se o crédito do Codex acabar agora

Claude deve:

1. analisar 100% do `inventops79` e mapear tudo que precisa migrar para o P7
2. reorganizar a estrutura por blocos reais:
   - Login
   - Carregamento
   - Home
   - Administração
   - Implantação
   - Especificação / DevOps
3. documentar claramente:
   - o que o P7 já tem
   - o que está faltando
   - o que precisa ser redesenhado
   - o que ele já pode adiantar sem quebrar a linha principal

## Depois que o Claude terminar

Devolver para o Codex com:

1. mapa estruturado `inventops79` x `P7`
2. backlog reorganizado por prioridade real
3. lista objetiva do que o Codex deve consolidar, implementar e publicar
## Operacao Assistida - checklist de aceite inventops79

Status em 2026-08-09: em consolidacao no P7.

Obrigatorio antes de dizer "pronto":

- [x] Daniel e Thomas aparecem como usuarios/validadores reais.
- [x] Implantacao e Especificacao/DevOps usam esteiras reais herdadas do inventops79.
- [x] Passagem de bastao existe como acao de produto.
- [x] Sinalizar prontidao existe como acao de produto.
- [x] Cobranca vira registro operacional.
- [x] Checkpoint concluido vira historico.
- [x] Handoff confirmado exige checklist completo.
- [x] Gate de aceite aparece na esteira e diferencia aberto / ajuste solicitado / aceito.
- [x] Solicitar ajuste antes do aceite gera chat e linha do tempo.
- [x] Chat operacional/contexto fica na mesma tela da area.
- [x] Home mostra bastoes em movimento com atalho para a area correta.
- [x] Administracao mostra Gate, ultima acao e proxima acao para Daniel/Thomas.
- [x] Validar usuario na Administracao altera estado e registra proxima acao.
- [ ] Validar visualmente com Daia em janela limpa.
- [ ] Claude revisar se a paridade com inventops79 ficou completa.
- [ ] Refinar login/orbita de departamentos em ciclo separado, sem bloquear uso real.

Regra: nao abrir outro grande redesenho antes de Daniel/Thomas conseguirem operar o fluxo basico ponta a ponta.

## Decisao operacional atual - 2026-08-09

Direcao aprovada pela Daia:

- `inventops79` e a referencia principal para elevar o P7.
- O P7 atual pode ser redesenhado quando necessario; nao fazer remendo se a estrutura impedir produto real.
- Nada de "demo" como narrativa principal.
- Home, Administracao e Operacao Assistida precisam deixar claro que o InventOps ja e produto real em construcao, com Daniel e Thomas como usuarios/validadores reais.

Prioridade imediata:

1. Garantir fluxo funcional para Implantacao/Daniel.
2. Garantir fluxo funcional para Especificacao-DevOps/Thomas.
3. Garantir Administracao com perfis, areas e contexto corporativo.
4. Manter Home como ponto de entrada executivo-operacional.
5. Registrar e publicar cada bloco antes de seguir.

Pendencias que nao devem travar o proximo bloco:

- Orbita de departamentos no login ainda corta alguns nomes em certas resolucoes.
- Refinar esta orbita com apoio do Claude, se necessario.
- Revisar acentuacao quebrada herdada em alguns textos internos do P7.

Regra de continuidade:

- Se Codex parar por credito, Claude deve primeiro ler `CONTINUIDADE-CODEX-CLAUDE.md` e este arquivo.
- Claude deve estruturar mapa `inventops79` x `P7`, nao criar outra linha paralela.
- Quando Codex voltar, consolida o que Claude adiantou na linha principal.
