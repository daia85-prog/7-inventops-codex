# Code Health — plano de continuidade InventOps

Atualizado em: 9 de agosto de 2026

## Por que este plano existe

Daia identificou corretamente que o InventOps está evoluindo rápido, mas ainda tropeça em problemas de base: textos quebrados, resquícios antigos, telas grandes demais e ajustes visuais que voltam a quebrar. Antes de acelerar novas telas, precisamos endurecer o produto para não refazer tudo depois.

## Ponto de parada atual

Último bloco concluído pelo Codex:

- Correção de textos quebrados/encoding no sistema.
- Menu principal corrigido.
- Roadmap com textos críticos corrigidos.
- Trava criada: `tools/check-text-quality.cjs`.
- Build validado.
- Documentação espelhada para Claude.

Próximo foco funcional aprovado:

> Transformar Daniel/Thomas + Administração + Home em fluxo funcional de produto real, usando `inventops79` como referência principal.

Mas antes de avançar pesado:

> Rodar saneamento do código e revisar tudo que pode gerar regressão.

## Diagnóstico de dívida técnica

Arquivos mais críticos hoje:

| Área | Arquivo | Risco |
|---|---|---|
| Estilos premium | `src/premium-overrides.css` | CSS grande, fácil criar efeitos colaterais visuais |
| Telas-base / Fundação | `src/FoundationModules.jsx` | Muitas páginas e regras no mesmo arquivo |
| Operação Assistida | `src/DepartmentCockpit.jsx` | Fluxo Daniel/Thomas concentrado; risco de quebrar regra real |
| Shell / navegação | `src/App.jsx` | Rotas, menus, login, sessão e topbar juntos |
| Modal de projeto | `src/ProjectControlModal.jsx` | Fluxo operacional relevante, ainda isolado mas grande |

## Nova estratégia de desenvolvimento

### 1. Sempre começar por guarda

Antes de mexer:

```bash
node tools/check-text-quality.cjs
npm run build
```

Depois de mexer:

```bash
node tools/check-text-quality.cjs
npm run build
```

Se qualquer um falhar, não seguir para nova tela.

### 2. Blocos pequenos e salváveis

Cada bloco precisa terminar com:

- O que foi alterado.
- O que foi validado.
- O que ficou pendente.
- Commit + push.
- Registro em `CONTINUIDADE-CODEX-CLAUDE.md`.

### 3. Refatorar sem reabrir produto

Pode reorganizar código para ficar mais seguro, mas sem mudar a decisão de produto sem evidência.

Permitido:

- Extrair componentes.
- Centralizar textos.
- Separar dados mockados de dados operacionais.
- Melhorar i18n.
- Remover código morto.
- Trocar CSS frágil por classes mais locais.

Não permitido:

- Criar uma segunda linha visual paralela.
- Reabrir Arquitetura 1.0.
- Voltar a chamar produto real de demo/protótipo.
- Quebrar Daniel/Thomas para “embelezar” tela.

## Ordem de saneamento recomendada

### Bloco A — Texto e i18n

Status: iniciado pelo Codex.

Checklist:

- [x] Criar trava de texto.
- [x] Corrigir menu principal.
- [x] Corrigir Roadmap antigo.
- [ ] Revisar visualmente todas as telas em PT/ES/EN.
- [ ] Centralizar textos sensíveis de Login/Home/Admin/Operação Assistida.

### Bloco B — Shell e navegação

Objetivo: parar de quebrar lateral/topbar/login quando mexer no produto.

Fazer:

- [x] Separar menu por módulos reais.
- [x] Remover Sidebar antiga não usada, que ainda carregava tema/perfil na lateral.
- [x] Renomear jornada interna de demo para jornada de produto.
- [x] Corrigir textos quebrados no Topbar de módulos de visão/roadmap.
- [ ] Remover seletores que não precisam ficar visíveis na lateral se reaparecerem em nova composição.
- Garantir que Administração concentre perfis/temas/acessos.
- Validar navegação Home → Operação Assistida → Administração.

### Bloco C — Home real

Objetivo: Home precisa guiar operação real, não parecer dashboard genérico.

Fazer:

- Trazer o melhor do `inventops79`.
- Mostrar Daniel/Thomas como bastões reais.
- Garantir atalhos corretos para área.
- Não deixar informações de teste antigas.

### Bloco D — Administração real

Objetivo: Administração governa usuário, perfil, área, capacidade e status operacional.

Fazer:

- Admin como local oficial de perfis.
- Daniel e Thomas com dados reais de área.
- Validar usuário altera estado e registra próxima ação.
- Preparar permissões por capacidade.

### Bloco E — Operação Assistida Daniel/Thomas

Objetivo: virar produto operacional demonstrável.

Fazer:

- Histórico.
- Chat.
- Passagem de bastão.
- Aceite/devolução.
- Sinalizar prontidão.
- Leitura por área.
- Regras herdadas do `inventops79`.

## Diretriz para Claude se o crédito do Codex acabar

Claude deve continuar por esta ordem:

1. Ler este arquivo.
2. Ler `CONTINUIDADE-CODEX-CLAUDE.md`.
3. Ler `PENDENCIAS-P7-P9.md`.
4. Rodar `node tools/check-text-quality.cjs`.
5. Rodar build.
6. Revisar arquivos críticos, começando por:
   - `src/App.jsx`
   - `src/FoundationModules.jsx`
   - `src/DepartmentCockpit.jsx`
   - `src/premium-overrides.css`
7. Fazer somente um bloco por vez.
8. Registrar ponto de parada depois de cada bloco.

Claude tem autonomia para:

- Corrigir telas que Codex não conseguiu finalizar.
- Redesenhar com base no `inventops79`.
- Remover resquícios antigos.
- Melhorar arquitetura interna de componentes.
- Sugerir refatoração quando reduzir retrabalho.

Claude não deve:

- Criar outro produto.
- Abrir nova arquitetura.
- Recomeçar do zero sem motivo.
- Fazer “maquiagem” sem comportamento real.

## Regra de decisão daqui para frente

Se uma mudança deixa o produto mais bonito, mas menos confiável, ela não entra.

Se uma mudança deixa o produto mais simples, mais funcional e mais apresentável, ela entra mesmo que precise reescrever parte do código.

## Frase-guia

Agora o objetivo não é lapidar tela. É transformar o InventOps em produto real, demonstrável e seguro para evoluir.
