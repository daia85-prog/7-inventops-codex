# Continuidade operacional — Codex ↔ Claude

Atualizado em: 8 de agosto de 2026

## 1. Linha principal oficial

- P7 / Codex = produto oficial
- P9 / Claude = laboratório, validação, crítica técnica, referência de UX e apoio de arquitetura

Regra: nenhuma evolução paralela deve criar uma segunda verdade do produto.

## 2. Prioridade atual

Foco imediato:

1. Login
2. Home
3. Administração
4. Implantação
5. DevOps / Especificação de Software

Objetivo:

- deixar pronto para teste com áreas reais
- elevar acabamento premium
- manter tudo funcional
- garantir PT / ES / EN

## 3. Regra de execução

- Uma tela por vez
- Só seguir para a próxima quando a atual estiver funcional
- Visual bonito não conta sozinho
- Todo avanço deve ser:
  - funcional
  - demonstrável
  - coerente com a navegação
  - trilíngue

## 4. Regra de produto

Toda entrega deve deixar claro se está em:

- Operacional
- Demonstração
- Simulado
- Prévia

Nunca confundir conceito visual com funcionalidade já integrada.

## 5. Regra de continuidade quando um lado parar

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

## 6. Regra de convergência

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

## 7. Ordem técnica realista

Enquanto elevamos o piloto visual e funcional:

- manter React + Vite como experiência principal
- preparar backend real por contratos
- separar demo de operação real
- fechar auditoria, tenant e permissões fora da interface

## 8. Meta desta fase

Transformar o InventOps de:

- protótipo executivo avançado

para:

- núcleo operacional confiável, bonito, demonstrável e pronto para piloto controlado

## 9. Frase-guia

Não ganhar por quantidade de telas.

Ganhar por clareza, confiança, evidência e continuidade.
