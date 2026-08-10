const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const app = read("src/App.jsx");
const foundation = read("src/FoundationModules.jsx");
const cockpit = read("src/DepartmentCockpit.jsx");

const checks = [
  {
    name: "Daniel entra como Gestor de Implantação",
    ok: app.includes('match: "daniel"') && app.includes('role: "Gestor"') && app.includes('dept: "IMP"'),
  },
  {
    name: "Thomas entra como Analista de Especificação/DevOps",
    ok: app.includes('match: "thomas"') && app.includes('role: "Analista"') && app.includes('dept: "ESP"'),
  },
  {
    name: "Sessão salva identidade operacional no navegador",
    ok: app.includes('sessionStorage.setItem("inventops-user"') && app.includes("setCurrentUser(profile)"),
  },
  {
    name: "Home abre Operação Assistida por departamento",
    ok: foundation.includes("openCockpitDept(area.code)") && foundation.includes("openCockpitDept(item.dept)"),
  },
  {
    name: "Home destaca contexto operacional da sessão ativa",
    ok: foundation.includes("session-operational-card") && foundation.includes("sessionArea") && app.includes("currentUser={currentUser} lang={lang}"),
  },
  {
    name: "Administração persiste validação de usuários operacionais",
    ok: foundation.includes("inventops-admin-users") && foundation.includes("readStoredAdminUsers") && foundation.includes("Validar usuário"),
  },
  {
    name: "Operação Assistida remonta ao trocar IMP/ESP",
    ok: app.includes("<DepartmentCockpit key={cockpitDept}") && app.includes("currentUser={currentUser}"),
  },
  {
    name: "Rotas diretas preservam Home/Admin/Operação por departamento",
    ok: app.includes("readRouteFromHash") && app.includes("routeTokenFor(active,cockpitDept)") && app.includes("operacao-devops") && app.includes("operacao-implantacao") && app.includes("administracao"),
  },
  {
    name: "Operação Assistida recebe a sessão ativa",
    ok: cockpit.includes("currentUser") && cockpit.includes("sessão {currentUser.name}"),
  },
  {
    name: "Operação Assistida persiste ações por departamento",
    ok: cockpit.includes("inventops-cockpit-state-") && cockpit.includes("window.localStorage.setItem(storageKey") && cockpit.includes("readStoredCockpitState(storageKey)"),
  },
  {
    name: "Operação Assistida exporta evidência operacional",
    ok: cockpit.includes("exportOperationalEvidence") && cockpit.includes("inventops-evidencia-") && cockpit.includes("Exportar evidência"),
  },
  {
    name: "Operação Assistida orienta uso real por área",
    ok: cockpit.includes("assisted-use-guide") && cockpit.includes("COMO USAR HOJE") && cockpit.includes("Gerar evidência da área"),
  },
  {
    name: "Login não volta para usuários antigos de teste",
    ok: !app.includes("admin.teste") && !app.includes("douglas.alves") && !foundation.includes("admin.teste") && !foundation.includes("douglas.alves"),
  },
  {
    name: "Login não vem com credenciais pré-preenchidas",
    ok: !foundation.includes('useState("daniel.almeida@invent-corp.com")') && !foundation.includes('useState("inventops2026")') && foundation.includes('runLogin(email || "admin@invent-corp.com")'),
  },
];

const failed = checks.filter((check) => !check.ok);

if (failed.length) {
  console.error("Falha na trava de fluxo operacional:");
  for (const check of failed) console.error(`- ${check.name}`);
  process.exit(1);
}

console.log("OK: fluxo operacional Daniel/Thomas/Home/Cockpit preservado.");
