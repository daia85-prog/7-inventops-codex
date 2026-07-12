# CLAUDE.md — 7 - InventOps (P7)

> ⚠️ **REGRA Nº 1 — NÃO PULAR, nem num "oi":** a 1ª resposta de TODA sessão começa com a linha de
> sync e o box `🟢 N OK · 0 avisos · 0 falhas` (números do hook/`_STATUS.txt`, igual aos demais projetos).

## Projeto

**Nome:** 7 - InventOps (P7) — o produto oficial, company-wide (14 departamentos)
**GitHub:** `https://github.com/daia85-prog/7-inventops` (privado · `main`)
**Fonte:** `Conta_Invent\7 - InventOps` · espelhos em `Conta_Velox` e `Conta_Pessoal` (só pull)
**Base:** Predictive Twin (React + Vite) — original preservado em `1 - Dashboard Projetos Velox\predictive-twin-demo`

## 🔴 REGRA Nº 0 — BLUEPRINT PRIMEIRO

**Nada se desenvolve sem estar desenhado no `BLUEPRINT-P7.md`.** Toda mudança de rumo passa pelo
blueprint ANTES do código (commit do blueprint → depois o código). Ele é a fonte de verdade de
visão, escopo, roadmap (5 eras), integrações (Nexus/SharePoint/Velox) e políticas.

## 💾 REGRA — SALVAMENTO POR BLOCO (pedido da Daiana, 12/07/2026)

A sessão pode acabar a qualquer momento (limite de conta). Por isso:

1. **Commit+push a cada BLOCO concluído** — terminou uma tela, uma função, um documento, uma
   correção? Commit+push NA HORA (`tipo(escopo): descrição`). Nunca acumular mais de ~20-30 min
   de trabalho sem push. Não esperar a tarefa inteira acabar.
2. **`_DIARIO.md` sempre com "PRÓXIMO PASSO" explícito** — ao fechar cada bloco, atualizar a
   linha "⏭️ PRÓXIMO:" com o que vem a seguir, específico o bastante pra outra sessão (ou outra
   conta) continuar SEM perguntar nada.
3. **Task list viva** — usar as ferramentas de tarefas (TaskCreate/TaskUpdate) espelhando os
   blocos; o estado delas + o diário = retomada instantânea.
4. **Rede de segurança de máquina:** o watchdog do P0 (15 min) já cobre o P7 por auto-descoberta;
   os hooks SessionStart/Stop puxam e convergem as 3 contas. As regras acima são a camada de
   TRABALHO por cima dessa rede.

## 📓 Diário de Bordo

`_DIARIO.md` na raiz — ler ao ABRIR (antes de varrer código), atualizar ao FECHAR cada ciclo/bloco.

## 🔎 REGRA — NÃO AFIRMAR SEM CONFIRMAR (feedback da Daiana, 12/07/2026)

Nenhuma frase de estado — "está feito", "está lá", "existe", "está documentado" — sem
**verificação no ato** (ler o arquivo, rodar o comando, testar). Se não verificou, dizer
"não verifiquei" explicitamente. Documentação que cita outro arquivo/config: abrir o citado
e conferir que bate ANTES de escrever. Contexto: 3 ocorrências em 12/07 (PMO "estava" na tabela
e não estava · "logins documentados" que não existiam · porta 3340 prometida sem config criada).

## 🤖 Autonomia e modelos

- **AUTONOMIA-99** (P0): executar tudo sozinho; parar só por risco de perda irreversível/produção.
- **Modelos:** desenhar no **Fable** · construir no **Sonnet** · varrer no **Haiku** · **Opus** =
  reserva estratégica do Fable (limite estourado ou modo /fast). Claude avisa descompasso.
- Validação consolidada NO FINAL (lista única), não pingar a cada etapa.

## 🛠️ Como rodar

```bash
npm install        # 1ª vez
npm run dev        # desenvolvimento (Vite)
npm run build      # gera dist/
```

Preview no Claude Code: config no `.claude/launch.json` da raiz `Code/` (porta 3340).

## 📁 Estrutura

| Caminho | O quê |
|---|---|
| `BLUEPRINT-P7.md` | O desenho oficial — LER PRIMEIRO |
| `src/App.jsx` | Shell, navegação, portfólio, simulador, comissionamento |
| `src/FoundationModules.jsx` | Dashboard exec, ação, gerencial, BI, áreas, RAID, admin, apresentação, login |
| `src/ProjectControlModal.jsx` | Central sobreposta do projeto |
| `src/styles.css` | Estilo (tokens de marca no topo — disciplina white-label) |
| `foundation/` | Arquitetura futura (Next/Postgres/Prisma — referência Era 2) |
| `_DIARIO.md` | Continuidade entre sessões |

## 🔒 Padrões herdados (P0 / Padrão Ouro)

- Repo privado · noindex · LICENSE proprietária · zero segredo em código · XSS escapado
- Honestidade de copy: demo não fala como produto; telas de futuro levam selo "VISÃO · ROADMAP"
- Dados separados das telas · marca como tema trocável · trilíngue PT-BR/ES/EN (seletor visível, "em breve")
- QA clique-a-clique + zero erro de console antes de qualquer apresentação
