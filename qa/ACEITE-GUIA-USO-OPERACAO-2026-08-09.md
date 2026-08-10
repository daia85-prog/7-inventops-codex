# Aceite — Guia de uso real da Operação Assistida

Data: 2026-08-09

## Objetivo

Evitar que Daniel, Thomas ou outro responsável entrem na área operacional sem saber o que fazer primeiro. A tela precisa orientar o uso real do fluxo: escolher projeto, executar ação, registrar histórico/chat e exportar evidência.

## Escopo aplicado

- Tela: Operação Assistida.
- Áreas principais: Implantação e Especificação/DevOps.
- Base de produto: `DepartmentCockpit`.

## Critérios de aceite

1. A tela mostra o bloco `COMO USAR HOJE`.
2. O texto se adapta ao responsável da área.
3. O usuário vê a sequência mínima:
   - Selecionar projeto.
   - Executar ação.
   - Registrar chat/histórico.
   - Exportar evidência.
4. O botão `Gerar evidência da área` usa a mesma função real de exportação do fluxo.
5. A tela continua responsiva em resoluções menores.
6. A trava `tools/check-operational-flow.cjs` reprova se o guia sair do produto.

## Validação

- Rodar `pnpm check:quality`.
- Abrir:
  - `/#operacao-implantacao`
  - `/#operacao-devops`
- Confirmar visualmente o bloco de orientação e o botão de evidência.

## Próximo passo recomendado

Aprofundar Daniel/Thomas dentro da Operação Assistida com regras já mapeadas no inventops79:

- histórico;
- chat;
- passagem de bastão;
- aceite/devolução;
- leitura por área;
- evidência de conclusão.
