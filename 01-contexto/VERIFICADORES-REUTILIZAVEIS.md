# Verificadores técnicos reutilizáveis — P7 Codex

## Objetivo

Registrar o que os verificadores locais do P7 realmente conferem, para que outros projetos possam
adotar a mesma intenção sem copiar módulos acoplados ao produto.

## Inventário factual

| Verificador | Execução | O que comprova | Limites |
|---|---|---|---|
| `tools/check-text-quality.cjs` | `node tools/check-text-quality.cjs` | Ausência de padrões conhecidos de mojibake, texto quebrado e termos de demo proibidos nos arquivos `src` JS/JSX/TS/TSX/CSS. | É uma lista de padrões; não revisa linguagem, acessibilidade, tradução nem conteúdo fora de `src`. |
| `tools/check-operational-flow.cjs` | `node tools/check-operational-flow.cjs` | Presença de marcadores estáticos do fluxo Daniel/Thomas, sessão, Home, Cockpit, Administração, rota e exportação de evidência. | Lê trechos de código; não autentica usuários, não persiste em backend e não executa o fluxo em navegador. |
| `tools/check-undefined-jsx.cjs` | `node tools/check-undefined-jsx.cjs` | Referências diretas a componentes, hooks e handlers JSX sem importação ou declaração local. | Análise sintática heurística; não substitui TypeScript, linter, testes de componente ou teste visual. |

## Forma de uso no P7

- A porta única é `npm run check:quality`, que executa os três verificadores e o build Vite.
- A evidência de 02/09/2026 registra `check:quality` concluído e `npm audit --omit=dev --audit-level=high` sem vulnerabilidades reportadas.
- Para outro projeto, reutilizar a regra e adaptar os critérios ao seu domínio; não importar estes
  arquivos sem revisar caminhos, personas e fluxos que são próprios do P7.

## Relação com a Biblioteca de Capacidades Invent

- O catálogo canônico possui `cap-skl-validar-catalogo`, de maturidade Rascunho e status
  Reproduzido. Ele valida manifests e o catálogo da Biblioteca; não é o mesmo tipo de verificação
  de interface ou fluxo do P7.
- Não foi criado pacote novo: faltam inventário multi-projeto e decisão de promoção para afirmar
  que estes scripts são um padrão compartilhado.

## Próximo gatilho

Quando houver ao menos um segundo projeto com verificadores equivalentes, comparar ativos e
evidências; só então propor uma capacidade Rascunho na Biblioteca.
