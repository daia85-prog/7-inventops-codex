# Roteiro de aceite - InventOps produto real

Data: 2026-08-09  
Objetivo: validar a jornada que será usada com as áreas antes de avançar novos módulos.

## Regra principal

Nada é considerado pronto apenas porque aparece na tela.

Para aprovar, precisa:

1. clicar;
2. executar uma ação;
3. manter estado após atualizar a página;
4. respeitar perfil/área;
5. permanecer funcionando em PT, ES e EN;
6. passar em `pnpm check:quality`.

## Sequência obrigatória

### 1. Login

- Abrir em janela limpa.
- Verificar que não existe e-mail ou senha pré-preenchidos.
- Testar troca de idioma PT/ES/EN.
- Entrar com:
  - `admin@invent-corp.com` ou Microsoft vazio: deve abrir como Admin;
  - e-mail contendo `daniel`: deve abrir como Daniel / Gestor / Implantação;
  - e-mail contendo `thomas`: deve abrir como Thomas / Analista / Especificação-DevOps.
- Confirmar que a tela de preparação aparece antes da Home.

Pendência conhecida:

- A órbita visual dos departamentos do login ainda precisa de ajuste fino para nomes longos. Não bloquear o fluxo funcional por isso.

### 2. Home

- Confirmar que a Home abre sem usuário antigo.
- Como Daniel:
  - deve aparecer contexto operacional de Implantação;
  - o atalho precisa abrir Operação Assistida na área correta.
- Como Thomas:
  - deve aparecer contexto operacional de Especificação/DevOps;
  - o atalho precisa abrir Operação Assistida na área correta.
- Como Admin:
  - deve abrir visão geral sem forçar área específica.

### 3. Administração

- Validar Daniel e Thomas.
- Atualizar a página.
- Confirmar que a validação permanece.
- Abrir contexto de Daniel: deve ir para Implantação.
- Abrir contexto de Thomas: deve ir para Especificação/DevOps.
- Criar um acesso novo e confirmar que fica salvo no navegador.

### 4. Operação Assistida

Validar primeiro Implantação/Daniel:

- Concluir checkpoint.
- Registrar cobrança.
- Sinalizar prontidão.
- Solicitar ajuste de handoff.
- Registrar mensagem no chat.
- Atualizar a página.
- Confirmar que estado, chat e linha do tempo permaneceram.

Validar depois Especificação/DevOps/Thomas:

- Repetir os mesmos passos.
- Confirmar que o estado de Thomas não mistura com o de Daniel.

### 5. Trava final

Antes de publicar ou chamar de pronto:

```powershell
pnpm check:quality
```

Resultado esperado:

- sem texto quebrado;
- sem marcador de demo/protótipo/mockup visível em `src`;
- fluxo Daniel/Thomas/Home/Cockpit preservado;
- build de produção verde.

## Próximo foco depois desse aceite

1. aprofundar regras de passagem de bastão;
2. ampliar leitura por área;
3. fechar visual premium tela por tela usando `inventops79` como referência principal;
4. só depois avançar diretoria e visão consolidada.

## Se o Codex ficar sem crédito

Claude deve seguir esta ordem:

1. ler `CONTINUIDADE-CODEX-CLAUDE.md`;
2. ler `PENDENCIAS-P7-P9.md`;
3. rodar `pnpm check:quality`;
4. validar este roteiro manualmente;
5. corrigir primeiro qualquer falha de fluxo real;
6. só então propor melhoria visual.

