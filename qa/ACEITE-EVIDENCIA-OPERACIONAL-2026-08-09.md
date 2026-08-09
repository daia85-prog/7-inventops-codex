# Aceite - Evidência operacional exportável

Data: 2026-08-09  
Bloco: Operação Assistida Daniel/Thomas

## O que foi adicionado

A Operação Assistida agora permite exportar uma evidência operacional da esteira selecionada.

O arquivo gerado contém:

- área;
- responsável;
- projeto;
- handoff previsto;
- status do aceite;
- checkpoints concluídos;
- pendências;
- últimos registros do chat;
- últimos handoffs da linha do tempo.

## Como validar

1. Entrar como Daniel ou Thomas.
2. Abrir a Operação Assistida da área.
3. Selecionar um projeto da esteira.
4. Clicar em `Exportar evidência`.
5. Confirmar que o navegador baixa um arquivo `inventops-evidencia-*.txt`.
6. Abrir o arquivo e verificar se os dados correspondem à tela.
7. Confirmar que uma nova linha entra no histórico/handoff dizendo que a evidência foi exportada.

## Critério de pronto

Não basta o botão aparecer.

Ele só está pronto se:

- gera arquivo;
- usa a área correta;
- usa a esteira correta;
- inclui chat e histórico;
- atualiza a linha do tempo;
- continua passando em `pnpm check:quality`.

