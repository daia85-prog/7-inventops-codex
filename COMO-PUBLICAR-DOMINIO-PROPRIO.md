# Domínio próprio do P7 (inventops-codex) — passo a passo

Diferente do P9 (que é HTML puro sem build), o P7 é **React + Vite** — precisa
rodar um build antes de publicar. Já testei aqui: `npm run build` gera a pasta
`dist/` sem erro (build de produção OK).

## Passo a passo (Cloudflare Dashboard)

1. Acesse **dash.cloudflare.com** → **Workers & Pages**.
2. Clique em **Create**.
3. ⚠️ **Ponto de atenção** (foi onde travamos no P9): a Cloudflare abre por
   padrão o fluxo de **Worker** ("Create a Worker" / "Deploy command: npx
   wrangler deploy"). Esse é o fluxo ERRADO pra gente. Procure especificamente
   a opção **Pages** — geralmente aparece como uma aba "Pages" ao lado de
   "Workers", ou "Import an existing Git repository" dentro da seção Pages.
   - Sinal de que está no fluxo certo: aparece o campo **"Build output
     directory"**.
   - Sinal de que está no fluxo errado: aparece **"Deploy command"** com
     `wrangler`.
4. Escolha o repositório **`daia85-prog/7-inventops-codex`**, branch **`main`**.
5. Configuração de build:
   - **Framework preset:** Vite (ou "None" preenchendo os campos abaixo à mão)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. **Save and Deploy**. Em ~1-2 min sai no ar no domínio que a Cloudflare der
   (ex.: `inventops-codex.pages.dev` ou o nome que você escolher pro projeto).
7. A partir daí, **todo push no `main`** republica sozinho.

## Como fica

- O `vite.config.mjs` já usa `base: "./"` (caminhos relativos), então funciona
  tanto na raiz do domínio quanto em subpasta — não precisa reconfigurar nada
  se decidir mudar o caminho depois.

## Enquanto não conectar

O produto já está testado e com build limpo localmente (`npm run
check:quality` passa: texto/i18n + fluxo operacional + build). Não há versão
publicada hoje além do que já roda localmente — diferente do P9, o P7 ainda
não tem um espelho público tipo `velox-demo.pages.dev`.

> Obs.: eu não consigo criar o projeto Pages sozinha (precisa do seu login no
> painel). O build e o código já estão prontos do meu lado — é só o clique de
> conectar.
