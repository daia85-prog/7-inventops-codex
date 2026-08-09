# Qualidade de texto, i18n e limpeza de código antigo

Este arquivo é uma trava operacional do InventOps. Nenhuma tela deve ser apresentada se houver texto quebrado, acentuação corrompida, narrativa de demo/protótipo ou código antigo aparecendo para o usuário.

## Regra principal

Produto real não pode parecer demo.

Antes de avançar para novas funcionalidades, validar:

- PT/ES/EN funcionando nas telas afetadas.
- Nenhum texto com mojibake, exemplo: `OperaÃ§Ã£o`, `AnÃ¡lise`, `RelatÃ³rio`, `â†’`.
- Nenhum texto visível chamando a experiência de demo, mockup, protótipo ou dados ilustrativos.
- Nenhum menu cortando nomes importantes.
- Nenhuma tela principal com copy antiga herdada de versões anteriores.

## Checagem automática

Rodar antes de publicar:

```bash
node tools/check-text-quality.cjs
```

Se falhar, corrigir antes de seguir.

## Ordem de revisão visual

1. Login.
2. Carregamento.
3. Home.
4. Administração.
5. Operação Assistida.
6. Implantação / Daniel.
7. Especificação-DevOps / Thomas.
8. Demais departamentos.

## Diretriz para Claude, se o crédito do Codex acabar

Claude tem autonomia para corrigir textos, menus, acentuação, i18n, navegação, leitura e organização visual das telas que o Codex não conseguir finalizar a tempo.

Mas deve respeitar:

- Não reabrir arquitetura.
- Não criar linha paralela.
- Usar `inventops79` como referência principal.
- Priorizar produto real, não aparência de demo.
- Registrar tudo em `CONTINUIDADE-CODEX-CLAUDE.md` e `PENDENCIAS-P7-P9.md`.
- Ao encontrar dificuldade visual ou técnica, registrar claramente: problema, tela, tentativa feita, sugestão para Codex.

## Regra de ouro

Se uma tela não puder ser defendida em apresentação executiva, ela não está pronta.
