# InventOps Predictive Twin

Demo executiva independente que evolui o InventOps de acompanhamento de status para previsão de gargalos no chão de fábrica.

## O que está demonstrado

- **Login, sessão e logoff:** entrada premium, opção Microsoft 365 demonstrativa, encerramento seguro e perfis Admin, Diretoria, Gestor e Analista.
- **Dashboard Executivo:** Health Score global, contagem regressiva para Go Live e briefing sobre quem o COO deve cobrar hoje.
- **Visões Ação, Gerencial, BI e Executivo:** checklist prioritário, tendências, gargalos, capacidade, Commit Grid e relatório one-page.
- **Controle de Projetos:** portfólio operacional, Kanban, busca e filtros, cadastro e Central Sobreposta com ficha técnica, sete fases, 14 áreas, atividades, responsáveis, prazos, evidências, auditoria, marcos, riscos e decisões.
- **Áreas Técnicas:** jornada matricial e Capacity Planning para COM, PMO, PCP, CMP, ENG, TI, DEV, MNT, PLC, HML, LOG, IMP, SUP e FIN.
- **Matriz RAID:** riscos, premissas, impedimentos e dependências em uma matriz 5×5 com Score de 1 a 25.
- **Smart Triage:** incidentes P0, P1 e P2, responsáveis, origem, SLA e evolução de status.
- **Administração:** RBAC demonstrável, regras obrigatórias de qualidade e trilha de auditoria.
- **Central de Comunicação:** Status Report com emojis, destinatário corporativo vinculado e ações reais para copiar, abrir o WhatsApp ou preparar o e-mail no Outlook.
- **Apresentação por Perfil:** roteiro interativo e objetivo para demonstrar o valor do InventOps como Analista, Gestor ou Diretor.
- **Simulador de Impacto:** transforma uma hipótese de atraso em cadeia de impactos, confiança, capacidade projetada e ação executiva.
- **Comissionamento em Tempo Real:** representa a telemetria da esteira, detecta falha no Sensor X e cria um alerta P0 com responsável e SLA.
- **Sala de Decisão:** conecta dependências entre projetos, capacidade da equipe PLC e evidências de execução.
- **Evidências:** explica o progresso com entregáveis, checklists, commits válidos e testes aprovados.
- **Releases & Roadmap:** visão interativa de 90 dias, 6 meses e 12 meses, com cinco eras estratégicas, donos, progresso, valor liberado e critérios de saída.

Os dados são simulados para apresentação. A experiência não envia dados externos e não armazena chaves no navegador.

## Roteiro sugerido para a diretoria

1. Entre pela tela de **Login** e abra o **Dashboard Executivo**.
2. Mostre o briefing de decisões e a fila da visão **Ação**.
3. Abra **Projetos**, entre no TITANO pela Central Sobreposta, mostre ficha, fases, atividades e use **Status Report** para preparar a comunicação.
4. Mostre **Áreas Técnicas**, a jornada pelas 14 áreas e a **Matriz RAID**.
5. Explique como essa base alimenta o **Simulador de Impacto** e a cadeia TITANO → QUELUZ → PLC.
6. Abra **Comissionamento**, normalize o Sensor X e simule uma nova falha P0.
7. Abra **Apresentação por Perfil**, alterne entre Analista, Gestor e Diretor e encerre com **Releases & Roadmap**, alternando entre 90 dias e 12 meses.

## Fundação técnica proposta

Os documentos em `foundation/` descrevem a arquitetura produtiva em Next.js, PostgreSQL/Prisma, autenticação corporativa, RBAC validado no servidor, tokens seguros para analistas, transações de importação e auditoria. A interface atual continua sendo uma demonstração estática e não se apresenta como backend produtivo.

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm build
```

A publicação está preparada para uma rota relativa, preservando a demo atual.
