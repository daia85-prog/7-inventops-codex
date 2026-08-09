# Continuidade operacional — Codex ↔ Claude

Atualizado em: 9 de agosto de 2026

## 1. Linha principal oficial

- P7 / Codex = produto oficial
- P9 / Claude = laboratório, validação, crítica técnica, referência de UX e apoio de arquitetura

Regra: nenhuma evolução paralela deve criar uma segunda verdade do produto.

## 2. Referência oficial desta fase

- `inventops79` passa a ser a referência principal de nível premium
- o P7 atual continua sendo a base funcional real do produto
- regra de trabalho:
  - comparar tela por tela
  - absorver o que `inventops79` tiver de melhor
  - trazer para o P7 tudo o que existir lá e ainda não existir aqui
  - preservar no P7 o que já estiver mais funcional, mais confiável ou mais maduro

Resumo da linha:

- `inventops79` = régua visual + régua funcional de referência
- `P7 atual` = produto real em evolução contínua
- nada de manter o P7 como “demo”; a partir desta fase a linguagem, a navegação e a experiência devem refletir produto real

## 3. Prioridade atual

Foco imediato:

1. Login
2. Carregamento / transição
3. Home
4. Administração
5. Implantação
6. DevOps / Especificação de Software

Objetivo:

- deixar pronto para teste com áreas reais
- subir o nível premium com base em `inventops79`
- manter tudo funcional
- garantir PT / ES / EN
- permitir uso real já na próxima semana com os perfis e áreas piloto

## 4. Regra de execução

- Uma tela por vez
- Só seguir para a próxima quando a atual estiver funcional
- Visual bonito não conta sozinho
- Referência obrigatória: antes de refinar a tela atual, comparar com `inventops79`
- Todo avanço deve ser:
  - funcional
  - demonstrável
  - coerente com a navegação
  - trilíngue

Checklist de comparação por tela:

- o que existe em `inventops79` e ainda falta no P7?
- o que em `inventops79` está visualmente melhor resolvido?
- o que no P7 atual já funciona melhor e deve ser preservado?
- o que precisa ser redesenhado, e não apenas “lapidado”?

## 5. Regra de produto

Toda entrega deve partir do princípio de produto real.

Regra nova:

- não chamar mais o P7 principal de demo
- textos, rótulos e narrativa principal devem refletir produto operacional
- se um módulo ainda for visão futura, chamar de expansão / roadmap / próxima camada do produto
- nunca vender conceito como se já estivesse integrado
- nunca rebaixar o que já é produto real chamando de “simulado” sem necessidade

## 6. Regra de continuidade quando um lado parar

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

## 7. Regra de convergência

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

## 8. Ordem técnica realista

Enquanto elevamos o piloto visual e funcional:

- manter React + Vite como experiência principal
- preparar backend real por contratos
- separar claramente expansão futura do que já está em operação real
- fechar auditoria, tenant e permissões fora da interface

## 9. Meta desta fase

Transformar o InventOps de:

- base funcional ainda desigual

para:

- núcleo operacional confiável, bonito, funcional, premium e pronto para piloto controlado

com esta ordem:

- Login 100%
- Home 100%
- Administração 100%
- áreas piloto 100%
- depois expansão para os demais departamentos

## 10. O que o Claude deve assumir ao continuar amanhã

- seguir a mesma ordem de telas e módulos
- usar `inventops79` como referência obrigatória
- ajudar a trazer para o P7:
  - componentes
  - lógicas
  - experiências
  - comportamentos
  - leitura premium
- não abrir linha paralela de produto
- registrar qualquer melhoria em um destes grupos:
  - entra já
  - entra depois
  - precisa validar com Daia
  - precisa consolidar no P7

## 11. Registro obrigatório de posição atual + próximo passo

Sempre que o Codex parar, encerrar sessão ou ficar sem créditos, deve deixar registrado:

- onde está exatamente no fluxo
- o que acabou de concluir
- o que está em andamento
- o próximo passo imediato
- o próximo passo estrutural
- o que pode ser feito pelo Claude sem esperar
- o que deve voltar para o Codex depois

Formato obrigatório:

### Estado atual do P7
- Data:
- Bloco atual:
- Última entrega concluída:
- Em andamento agora:
- Próximo passo imediato:
- Próximo passo estrutural:
- Riscos / travas:

### Se o crédito do Codex acabar agora
Claude deve:
1.
2.
3.

### Depois que o Claude terminar
Voltar para o Codex com:
1.
2.
3.

## 12. Protocolo de continuidade entre créditos

Objetivo: impedir retrabalho e permitir que Claude avance com autonomia útil enquanto o Codex estiver parado.

Regras:

- Claude não deve tentar “reinventar” a linha principal.
- Claude deve primeiro estruturar, revisar, organizar e preparar terreno.
- Claude pode:
  - analisar `inventops79` em profundidade
  - mapear tela por tela o que precisa entrar no P7
  - reorganizar backlog e prioridades
  - registrar melhorias visuais/funcionais por módulo
  - atacar pontos pendentes claramente documentados
  - propor refinamentos para Home, Administração, perfis e departamentos piloto
- Claude não deve:
  - trocar arquitetura principal
  - abrir produto paralelo
  - mudar contrato de domínio congelado

## 13. Handoff operacional padrão

Se o crédito do Codex acabar, o Claude deve seguir nesta ordem:

1. Revisar 100% do `inventops79`
2. Produzir mapa: `inventops79` x `P7 atual`
3. Separar por grupos:
   - já existe e está bom
   - existe mas precisa redesenhar
   - existe no `inventops79` e falta no P7
   - existe no P7 mas precisa reorganizar
4. Estruturar a base para:
   - Login
   - Carregamento
   - Home
   - Administração
   - Implantação
   - Especificação / DevOps
5. Registrar claramente o que ele fez e o que devolve para o Codex implementar / consolidar

Depois disso, quando o Codex voltar, a retomada deve ser:

1. consolidar no P7 o que o Claude estruturou
2. validar funcionalidade real
3. publicar
4. seguir para o próximo bloco sem reabrir discussão antiga

## 14. Frase-guia

Não ganhar por quantidade de telas.

Ganhar por clareza, confiança, evidência e continuidade.
