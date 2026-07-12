# 📐 BLUEPRINT — P7 · InventOps
### O desenho oficial do produto, aprovado ANTES de qualquer desenvolvimento

> **Regra de nascimento deste documento (Daiana, 12/07/2026):** nada se constrói no P7 sem estar
> desenhado e estruturado aqui primeiro. Este é o mapa; o código é consequência.
> Escrito em linguagem simples de propósito — tecniquês só nos anexos.

---

## 1. Visão em um parágrafo

O **InventOps** é o sistema operacional dos projetos da Invent, **operado pelo PMO — o coração
que bombeia os projetos pela empresa**: a fonte única de verdade que acompanha cada projeto
atravessando os **14 departamentos** — do Comercial ao Pós-vendas — com visão por nível de
acesso (analista · gestor · diretor), progresso provado por **evidências** (não por "achismo
de %") e riscos antecipados por **simulação**. A conexão com o **chão de fábrica** (sensores/CLP)
é a **visão de futuro** do produto — apresentada sempre como roadmap, nunca como promessa de
agora. Nasce como demo para a Invent e é desenhado desde o primeiro dia para virar **produto
vendável a outras empresas** (multi-empresa, marca trocável, **trilíngue PT-BR · ES · EN** —
a Invent é uma empresa Comau: público internacional desde já).

## 2. O ecossistema em linguagem simples

Pensa no InventOps como um **hospital de projetos**:

| Peça | Papel no hospital | Em uma frase |
|---|---|---|
| **Nexus (P3/P6, do Rapha)** | A **recepção/triagem** | É onde o projeto "dá entrada": o gestor faz o kickoff e preenche a ficha do paciente |
| **InventOps (P7 — nosso)** | O **centro cirúrgico + UTI + painel dos médicos** | Acompanha o projeto vivo: quem cuida, o que trava, risco, previsão |
| **SharePoint (P5)** | O **arquivo/prontuário** | Onde ficam os documentos oficiais que os times compartilham |
| **Velox demo (P1)** | O **piloto que provou o conceito** | O que o Igor viu; continua no ar como vitrine e fonte dos dados reais de infra |
| **P0 Infra** | As **normas do hospital** | Não é um sistema: é o conjunto de regras de como trabalhamos (sync, segurança, qualidade) |

## 3. O fluxo desenhado (a espinha dorsal)

```
   NASCE                    VIVE                              DOCUMENTA
┌──────────┐   JSON    ┌─────────────────────────┐   link/upload   ┌────────────┐
│  NEXUS   │ ────────► │       INVENTOPS         │ ──────────────► │ SHAREPOINT │
│ kickoff  │           │  projeto · 14 deptos ·  │                 │  arquivos  │
│ do gestor│           │  riscos · evidências ·  │ ◄────────────── │  oficiais  │
└──────────┘           │  simulação · cobrança   │    consulta     └────────────┘
                       └─────────────────────────┘
                                  ▲
                    P0: regras de trabalho (sync, segurança,
                    qualidade, autonomia) valem em tudo
```

**A história de um projeto:** o gestor faz o kickoff no Nexus → o InventOps importa o JSON e o
projeto JÁ NASCE com ficha técnica, % por seção e as pendências de cada departamento → cada área
trabalha no seu Cockpit e "passa o bastão" com carimbo de hora ("Infra liberou acessos ✓ 14:32 →
Implantação notificada") → documentos oficiais vivem no SharePoint, linkados no projeto → a
diretoria vê saúde, risco e previsão sem perguntar nada em grupo de WhatsApp.

## 4. Integração NEXUS → InventOps (o contrato de dados)

**O que o Nexus já entrega hoje** (verificado no arquivo real `Nexus_Kickoff_BR_SUPLLY_I26.4018.json`):

- `meta` — nome, código I26.xxxx, data, % total preenchido
- `sections` — **14 seções técnicas** (Info Gerais, Layout, Cubagem, Integração, Order Start,
  PBL/FlowRack, Picking Cart, Full Case, Packing, Sorter, PTL, Estoque, Etiquetas e…
  **Infraestrutura** 🎯) com os campos preenchidos ou `tbd`
- `progress` — % de preenchimento POR SEÇÃO (ex.: Infra 10% = 9 pendências)
- `notes` + `meeting_notes` — anotações da reunião de kickoff

**Como o InventOps usa (regra de design):**
1. Importar o JSON = criar o projeto com a ficha pré-preenchida (prévia antes de aplicar,
   nunca duplica — padrão que o P1 já provou).
2. Cada campo `tbd` de uma seção **vira pendência do departamento dono da seção** — ex.: os 9
   `tbd` de Infraestrutura entram como demandas no Cockpit da Infra. **O kickoff já distribui
   trabalho pra empresa inteira automaticamente.**
3. O `progress` por seção alimenta a Jornada dos 14 departamentos desde o dia zero.
4. O P6 do Rapha (mesma família Nexus) usa banco Supabase com as mesmas entidades — quando o
   InventOps ganhar banco (Era 2), a conversa Nexus↔InventOps deixa de ser por arquivo e passa
   a ser direta. **Decisão registrada: manter o JSON como contrato estável** (funciona com P3
   hoje e com P6 amanhã, sem depender do Rapha terminar).

## 5. Integração SHAREPOINT (P5) — em 3 fases honestas

| Fase | O que faz | Quando |
|---|---|---|
| **F1 — Link vivo** (demo) | Cada projeto tem seu cartão "Documentos do projeto" com link direto pra página/pasta dele no SharePoint (`proj-<código>.aspx`, padrão já confirmado no P5) | **Amanhã** |
| **F2 — Espelho** | O InventOps LÊ do SharePoint a lista de arquivos do projeto (nome, quem subiu, quando) e mostra dentro do sistema | Era 2-3 |
| **F3 — Mão dupla** | Upload pelo próprio InventOps (o arquivo vai pro SharePoint por trás; login Microsoft 365 único) | Era 3 |

> Por que assim: o SharePoint é o próximo foco da empresa pra organizar documentos entre times.
> O InventOps **não compete** com ele — usa ele como cofre oficial. F1 já resolve o "onde está
> o documento?" na demo sem prometer o que ainda não existe.

## 6. A tecnologia — traduzida pra gente

| Peça | O que é, em inglês de gente | Por que essa |
|---|---|---|
| **React** | O jeito moderno de montar telas: peças de Lego reaproveitáveis | O mercado inteiro usa; qualquer dev continua o projeto |
| **TypeScript** | Português com gramática corrigida: o código avisa o erro ANTES de rodar | Menos bug bobo; padrão do Rapha e do mercado (entra na Era 1.5) |
| **Vite** | O forno rápido: transforma o código no site publicado em segundos | Já usado no P6 e no Predictive Twin |
| **Supabase** | Banco de dados pronto na nuvem (PostgreSQL, o banco mais respeitado) com login e permissões inclusos | O Rapha já usa no P6 = estrada conhecida DENTRO de casa (Era 2) |
| **Zod** | O porteiro: confere se todo dado que entra tem o formato certo | Já é padrão nosso (P6/Padrão Ouro) |
| **SSO Microsoft 365** | Entrar com a conta da empresa, sem senha nova | A Invent (e qualquer cliente corporativo) vive no M365 |
| **Playwright + CI** | Robô que clica no sistema inteiro a cada mudança e acusa se algo quebrou | Rapha usa no P6; qualidade sem depender de olho humano |
| **i18n PT-BR/ES/EN** | Sistema trilíngue por troca de dicionário, não por reescrita | Invent é Comau (público internacional) + Market Peru/Chile/Guatemala; decisão da Daiana 12/07: **três idiomas são padrão do produto** |

**Decisões anti-arrependimento (as duas disciplinas de berço):**
1. **Dados separados das telas** — nunca escrever dado dentro do componente; sempre em arquivos
   de dados próprios. É o que permite trocar demo→banco sem refazer tela.
2. **Marca separada do produto** — cores/logo/nome como "tema" trocável. É o que permite
   vender white-label (outra empresa, outra cara, mesmo motor).

## 7. Roadmap do produto — 5 eras

| Era | Nome | O que entrega | Analogia |
|---|---|---|---|
| **1 · AGORA** | Controle governado | Demo empresa-inteira: 14 deptos reais, Cockpit de departamento, import Nexus, link SharePoint | A maquete rica da casa |
| **1.5** | Fundação técnica | TypeScript + testes Playwright + CI + dados/tema separados | Reforço da estrutura antes de morar |
| **2** | Operação conectada | Banco real (Supabase) + login M365 + fim do "salvo só no navegador" | A casa ganha luz e água |
| **3** | Integrações vivas | SharePoint F2/F3 · notificações reais (e-mail/WhatsApp/Teams) · Outlook/Planner | A casa conectada à rua |
| **4** | Inteligência | Simulador calculando de verdade sobre o histórico · previsão de gargalo | A casa que avisa antes de dar problema |
| **5** | Chão de fábrica & ecossistema Velox | Telemetria CLP/IoT real no Comissionamento + **integração com o sistema WCS Velox e os servidores dos projetos** (saúde do ambiente, versão instalada, status por projeto — sistemas conversando entre si) | O diferencial que ninguém no mercado de PMO tem: o sistema de projetos conectado ao produto entregue |

**Era 5 detalhada — o fim do "Velox a sete chaves" (Daiana, 12/07):** hoje a informação do que
o dev entrega e de qual Velox roda em cada cliente é guardada pelo time de dev — e é **dado da
empresa, não do time**. A Era 5 devolve isso pra empresa em 4 peças:
1. **Passaporte do projeto** — qual versão do WCS Velox roda em cada cliente, em qual servidor,
   desde quando (inventário vivo; Pós-vendas e Suporte param de "perguntar pro dev")
2. **Release notes visíveis** — dev soltou versão nova → a empresa inteira vê o que mudou e
   quais clientes recebem
3. **Matriz cliente × versão × funcionalidades** — o Comercial sabe o que pode vender de upgrade;
   o Suporte sabe o que o cliente tem
4. **Progresso do dev por evidência** — a tela de Evidências conectada ao repositório real do
   Velox: commits/builds/testes viram dado automático — **transparência sem depender de boa
   vontade** (mesma régua de evidência que vale pros outros 13 departamentos)
> Nota política (honestidade): isso muda cultura, não só tela — apresentar como "transparência
> padrão da empresa" com patrocínio da diretoria, nunca como fiscalização do dev.

**Regra de ouro do roadmap:** cada era só abre quando a anterior tem **critério de saída** batido
(o app já traz isso na tela Releases & Roadmap — vira o roadmap oficial, realinhado a estas eras).

## 8. Regras herdadas do P0 (o coração que dita as normas)

- **DoD (Definition of Done):** código ✅ · sintaxe ✅ · preview validado no navegador ✅ ·
  commit+push ✅ · 3 contas convergidas ✅ · `_ROTEIRO.md`/`_DIARIO.md` atualizados ✅
- **Sync:** commit+push automático ao fechar qualquer tarefa; nada importante >15min só local
- **Segurança de fábrica:** repo privado · noindex · LICENSE proprietária · CSP/headers ·
  zero segredo em código · XSS escapado sempre
- **Honestidade de copy:** demo não fala como produto ("prepara o e-mail" ≠ "envia sozinho") —
  auditoria de escrita antes de qualquer apresentação
- **QA pré-apresentação:** ritual clique-a-clique com zero erro de console
- **Continuidade:** `_DIARIO.md` + `_ROTEIRO.md` no repo (memória que viaja entre máquinas/contas)

## 9. Autonomia, modelos e economia de tokens (política oficial do P7)

**Autonomia — padrão AUTONOMIA-99 (herdado e reafirmado):** Claude executa tudo sozinho; só para
e pergunta se houver risco de perda irreversível/produção. Validação consolidada NO FINAL
(uma lista única), não pingando a cada etapa.

**Qual modelo usar quando (decisão do Claude, avisando quando houver descompasso):**

| Modelo | Quando | Exemplos no P7 |
|---|---|---|
| **Fable 5** (máximo) | Decisão cara de errar: arquitetura, produto, auditoria final pré-diretoria, pente-fino adversarial | Este blueprint · a noite pré-Igor |
| **Opus 4.8** (estratégico-rápido) | Mesmo tipo de trabalho do Fable quando: o Fable não está disponível/estourou o limite da conta, OU a tarefa estratégica é grande e o modo rápido (/fast, exclusivo do Opus) compensa | Pente-fino longo · dia de limite estourado |
| **Sonnet 5** (padrão) | O dia a dia de construir: telas, ajustes, docs, integrações já desenhadas | Implementar o Cockpit já especificado |
| **Haiku 4.5** (mecânico) | Tarefa repetitiva sem decisão: renomear, sync, varredura simples | Trocar domínio de e-mail em N arquivos |

Regra prática: **desenhar no Fable, construir no Sonnet, varrer no Haiku.** Quem monitora o
descompasso é o Claude (aviso na hora, você decide a troca).

**Ferramentas novas do Claude Code adotadas no P7** (registrado 12/07/2026):
- **Workflows multi-agente** ("ultracode") p/ pente-fino: vários revisores independentes + verificação
  adversarial de cada achado — usar nas auditorias pré-apresentação
- **/code-review** no fim de cada ciclo grande de código
- **Tarefas agendadas** p/ rotinas (já usamos no watchdog; candidata: auditoria semanal do P7)
- **Sessão própria:** criar a sessão **"7 - InventOps"** no padrão da casa (trabalho do P7 roda nela;
  o guarda-chuva continua na sessão 0)

**Princípio-mestre da economia (tese da Daiana, 12/07):** *token só se gasta onde existe
DECISÃO; toda repetição vira automação determinística (hook, script, watchdog, CI) — que custa
zero, pra sempre.* A meta de longo prazo é edição/ajuste rotineiro tender a token-zero: o Claude
desenha, revisa e decide; os robôs (CI/testes/hooks/deploy) executam e verificam o repetitivo.
O watchdog de 15 min é exemplo: rede de segurança git por Tarefa Agendada do Windows — 0 token
em qualquer frequência; 15 min é escolha de HIGIENE (histórico limpo, OneDrive em paz), não de custo.

**Economia de tokens (como gastamos pouco e rendemos muito):**
1. Ler `_ROTEIRO.md`/`_DIARIO.md` ANTES de varrer código (contexto em 2 arquivos, não em 200)
2. Uma sessão por assunto (não misturar P7 com infra geral)
3. Tarefa mecânica → modelo menor
4. Validação consolidada no final (não re-verificar a cada micro-passo)
5. Blueprint primeiro (este doc) = zero retrabalho de "construí a coisa errada"

## 10. O que entra na DEMO de amanhã (Era 1) — escopo fechado

1. ✅ Base: Predictive Twin promovido a P7 (feito — original preservado)
2. **Transplante de realidade:** 14 departamentos reais + gestores reais + domínio `@invent-corp.com`
3. **Cockpit "Meu Departamento":** minhas entregas · o que espero · quem espera por mim ·
   botão "Concluir e notificar próxima área" com carimbo de hora
4. **Import Nexus:** carregar o JSON real de kickoff → projeto nasce distribuído nos 14 deptos
   (a cena: "o kickoff do gestor virou trabalho distribuído pra empresa inteira, sozinho")
5. **Cartão SharePoint (F1):** link "Documentos do projeto" nos projetos
6. **Vídeo do Igor:** kit consolidado (velox-demo) + capítulo final apontando o InventOps
7. **Deploy:** rota garantida no `velox-demo.pages.dev` + URL própria na sequência

**Fora do escopo de amanhã (com data pra entrar):** TypeScript, banco, SSO real, upload
SharePoint, notificação real por e-mail, tradução ES/EN — tudo mapeado nas eras acima. A demo
NÃO finge que já tem isso (honestidade de copy).

**Regra de expectativa (Daiana, 12/07):** as telas de **Comissionamento/CLP** e o **Simulador**
ficam na demo, mas SEMPRE rotuladas/narradas como **visão de futuro do roadmap** (selo visual
"VISÃO · ROADMAP") — mostram aonde o produto vai, sem gerar expectativa de que já existe. O mesmo
vale pra **integração com o sistema WCS Velox/servidores** (Era 5): aparece como visão, nunca
como promessa de agora.

**Idiomas na demo (Daiana, 12/07):** o seletor **PT-BR · ES · EN aparece no visual desde amanhã**
(bandeirinhas/menu no topo) — PT-BR ativo; ES e EN mostram **"em breve · disponível na próxima
versão"** ao clicar/passar o mouse. O produto já se apresenta internacional (Invent é Comau);
a tradução completa entra na Era 1.5.

---

## 11. Pente-fino de lacunas (12/07 — pedido da Daiana: "o que estamos deixando passar?")

O blueprint foi varrido com a pergunta *"o que um produto de verdade tem que ainda não escrevemos?"*.
Dez lacunas reais encontradas e adotadas, cada uma com a era certa:

| # | Lacuna | Por que importa | Entra em |
|---|---|---|---|
| 1 | **Celular / PWA** | Gestor vive em obra, fábrica e viagem — o sistema precisa funcionar e instalar no celular (o P1 já domina PWA; herdar) | Era 1.5 (responsivo) · Era 2 (instalável) |
| 2 | **Backup & exportação** | Dado do usuário NUNCA pode se perder; exportar/importar tudo em um clique (herança do Admin do P1) + backup automático quando houver banco | Era 1.5 (export) · Era 2 (backup auto) |
| 3 | **LGPD & privacidade** | O sistema carrega nomes e e-mails de colaboradores; produto vendável (e empresa Comau) exige política de dados pessoais, retenção e acesso | Era 2 — antes de dados reais em banco |
| 4 | **Ambientes separados** (demo · homologação · produção) | A Invent entrega isso pros clientes dela; o nosso produto merece o mesmo — nunca apresentar em cima de dado de trabalho | Era 2 |
| 5 | **Dono do dado** (governança de edição) | Cada informação tem UM dono: kickoff = gestor no Nexus · status da área = o departamento · risco = PMO. Evita dado sobrescrito e "guerra de edição" | Regra desde a demo |
| 6 | **Re-import do kickoff com comparação** | O kickoff evolui depois da reunião; re-importar mostra O QUE MUDOU antes de aplicar (padrão prévia que o P1 já provou) | Era 1–2 |
| 7 | **Migração dos dados do velox (P1→P7)** | Quando o P7 virar o sistema oficial, os dados reais de infra migram por importador — ninguém redigita nada | Era 2 |
| 8 | **Kit de adoção por departamento** | "Empresa inteira" só funciona se cada área tiver dono, marcos padrão e treino de 15 min — senão vira tela vazia e o sistema morre | Era 2–3 (processo + material) |
| 9 | **Telemetria de adoção** | Medir quem usa e quem atualiza, por área — pra provar valor ao Igor com número, não com sensação | Era 2 |
| 10 | **Acessibilidade (a11y)** | Padrão que sua campanha pente-fino já elevou nos 6 projetos + regras automáticas do P6; produto vendável será cobrado disso | Contínuo, desde a demo |

> Método pra não repetir o "caso Opus": toda mudança de rumo passa por este documento, e
> **a cada fechamento de era roda-se um pente-fino adversarial** (revisores independentes,
> ferramenta de workflow multi-agente) sobre o blueprint E o código.

## 12. Pente-fino nº 2 (12/07) — lente de EXECUÇÃO e risco de apresentação

Segunda varredura, outra pergunta: *"o que pode dar errado AMANHÃ e na operação do projeto?"*
Sete riscos reais, cada um com resposta pronta:

| # | Risco | Resposta adotada |
|---|---|---|
| 1 | **Sessão acabar no meio do trabalho** (limite de conta) | **Regra de salvamento por bloco** no `CLAUDE.md` do P7: commit+push a cada bloco concluído (~20-30 min máx sem push) + `_DIARIO.md` sempre com "PRÓXIMO PASSO" explícito + task list viva. Rede de máquina: watchdog 15 min já cobre o P7 (auto-descoberta verificada) |
| 2 | **Build do P7 dar problema em cima da hora** | **Apresentação em camadas:** Camada 1 = P7 novo · Camada 2 = Predictive Twin atual (JÁ no ar e validado em `velox-demo.pages.dev/predictive-twin/`) · Camada 3 = velox-demo clássico. Nunca ficamos sem demo |
| 3 | **Vídeo com dados reais circulando** (clientes Stellantis/Falabella, nomes de colegas — vídeo vaza fácil) | Vídeo pro Igor = uso interno, ok. Se um dia for pra fora (Instagram/venda), regravar com dados mascarados — decisão já registrada aqui pra ninguém esquecer |
| 4 | **Telão/resolução da sala** | Lição do P1 (título cortado em 1280×720): QA final roda TAMBÉM em 720p. Testar na resolução do projetor antes |
| 5 | **Acessos da demo na hora H** | Logins demo (admin/gestor/analista) documentados no `CREDENCIAIS.md` da raiz `Code/` (gitignored) — quem apresenta acha em 10 segundos |
| 6 | **Quem apresenta não é quem construiu** (Douglas/Igor mexendo sozinhos) | Material auto-explicativo: tour + legendas + **roteiro de bolso de 1 página** pro apresentador (entra no kit do vídeo) |
| 7 | **OneDrive × node_modules** (P7 vive no OneDrive; P2/P3 já sofreram com poluição) | `node_modules`/`dist` fora do git ✅; se builds ficarem lentos/instáveis, aplicar **Opção A** (`.git` fora do OneDrive — ferramenta pronta: `OPCAO-A-GIT.sh`). Risco conhecido, monitorado, com cura de prateleira |

---

_Aprovado por: Daiana (pendente) · Escrito por: Claude (Fable 5) · 12/07/2026_
_Este documento evolui por commit; mudanças de rumo passam por aqui antes do código._
