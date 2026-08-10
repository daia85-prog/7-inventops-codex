# Varredura de texto legado - InventOps

Data: 2026-08-09  
Objetivo: evitar que textos antigos, linguagem de demo ou credenciais antigas voltem para o produto.

## Resultado objetivo

A trava automatizada `pnpm check:quality` passou.

Isso significa que, nas telas principais em `src`, não foram encontrados:

- texto quebrado;
- mojibake visível;
- marcador visível de demo/protótipo/mockup;
- usuários antigos `Douglas` ou `admin.teste` no fluxo principal;
- credenciais pré-preenchidas antigas no login.

## O que ainda aparece fora do produto

A busca ampla encontrou termos como `demo`, `protótipo`, `Douglas` e `Cockpit do Piloto` em documentos históricos, blueprints, roadmaps antigos e registros de decisão.

Esses arquivos não devem ser limpos às cegas porque alguns servem como histórico do projeto.

## Regra para Claude e Codex

Antes de alterar qualquer referência antiga, classificar:

1. `src` ou tela visível: corrigir imediatamente.
2. documento operacional atual: atualizar para produto real.
3. documento histórico: manter, salvo se estiver confundindo o próximo desenvolvimento.
4. roadmap/registro antigo: preservar contexto e, se necessário, adicionar nota de substituição.

## Próximo foco recomendado

Não gastar tempo tentando apagar todo o histórico.

Focar em:

1. Operação Assistida Daniel/Thomas;
2. Administração funcional;
3. Home conectando ações reais;
4. auditoria visual e textual somente nas telas ativas.

