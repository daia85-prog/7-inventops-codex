# Segurança, validação e governança

## Matriz RBAC

| Perfil | Rotas | Ações |
|---|---|---|
| ADMIN | Todas | CRUD, importação/exportação, usuários, permissões e auditoria |
| EDITOR | Dashboard, Ação, Gerencial, BI, Projetos, Áreas, Alertas, Releases | Criar/editar projetos e tarefas, gerar relatórios |
| VIEWER | Dashboard, Executivo, Áreas, Alertas, Releases | Leitura, filtros e solicitação de cobrança |
| ANALISTA | `/tarefa/[id]` | Ler e atualizar somente a própria tarefa/evidência |

O middleware redireciona navegação indevida para `/403-access-denied`. APIs e Server Actions repetem a autorização; esconder menu não é segurança.

## Sessão

- OIDC corporativo e MFA conforme política da empresa.
- Cookie de sessão `HttpOnly`, `Secure`, `SameSite=Lax`, duração curta e rotação.
- CSRF para mutações, rate limit, headers de segurança e logs de autenticação.
- Segredos somente no cofre do ambiente; nunca no bundle, Git ou `localStorage`.

## Link seguro do analista

1. Gerar 32 bytes aleatórios criptograficamente seguros.
2. Armazenar apenas `SHA-256(token)` com tarefa, e-mail, expiração e estado de uso.
3. Entregar `/tarefa/{id}?token={token}` por canal autorizado.
4. Validar hash, expiração, revogação, tarefa e e-mail da sessão.
5. Aplicar rate limit e registrar sucesso/falha na auditoria.

## Consistência de projeto

- `CONCLUIDO` → progresso 100, dias de atraso 0 e data de conclusão obrigatória.
- `BLOQUEADO` → categoria, dono, próxima ação e previsão obrigatórios.
- Datas devem respeitar `inicio <= prazoPlanejado <= prazoAjustado` quando aplicável.
- Evidência deve possuir origem, autor, data, tipo e hash/identificador verificável.
- Alterações de peso do progresso exigem permissão administrativa e auditoria.

## Importações

- Upload em quarentena e verificação de tipo/tamanho.
- Parser no backend, schema versionado e validação linha a linha.
- Prévia dos erros antes da confirmação.
- Gravação em transação única ou lotes idempotentes.
- Em falha: rollback e relatório; dados existentes permanecem intactos.

## Auditoria

Registrar ator, perfil, ação, entidade, antes/depois redigidos, correlação, IP aproximado, user-agent e timestamp. Senhas, tokens e segredos nunca entram no log.

