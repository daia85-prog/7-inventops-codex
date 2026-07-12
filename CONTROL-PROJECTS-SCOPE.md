# Núcleo de Controle de Projetos

## Objetivo

Criar a base operacional que alimentará o InventOps Predictive Twin. A previsão só será confiável quando fases, atividades, responsáveis, dependências, marcos, riscos e evidências estiverem estruturados.

## O que foi aproveitado do InventOps atual

- Estrutura de sete fases: Kickoff, Levantamento, Provisionamento, Implantação, Homologação, Go Live e Encerramento.
- Cadastro de projeto com código, cliente, local, PMO, responsável, prioridade e datas.
- Atividades organizadas por fase, com status, dono, prazo e comentários/evidências.
- Marcos múltiplos para projetos como QUELUZ.
- Bloqueador, próxima ação, dono da cobrança e mapa de riscos.
- Métricas de progresso, dias sem atualização e saúde do portfólio.

## Evolução implementada na demo preditiva

1. Portfólio operacional com KPIs, filtros, busca, risco, fase, progresso e próximo marco.
2. Cadastro funcional de projeto com inclusão imediata na carteira.
3. Central do Projeto com saúde, progresso baseado em evidências, fase atual e plano de trabalho.
4. Jornada visual com gates de governança.
5. Atividades editáveis e inclusão de nova atividade.
6. Evidências de engenharia visíveis na mesma tela.
7. Marcos, riscos, bloqueadores, decisões e registro de cobrança.
8. Experiência responsiva, preservando o simulador, IoT, alertas e Sala de Decisão.

## Próximas camadas para produção

1. Banco de dados e autenticação por perfil.
2. APIs de projetos, atividades, fases, evidências, riscos e marcos.
3. Integrações com Planner/DevOps/Git e documentos homologados.
4. Motor de dependências e capacidade baseado nos dados reais.
5. Telemetria CLP/IoT e criação automática de incidentes.
6. Modelo preditivo e Genius AI utilizando a base operacional consolidada.

