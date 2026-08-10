// Remove do styles.css os seletores top-level 100% sombreados pelo
// premium-overrides.css (relatorio gerado por dead-css-report.cjs).
// So remove os que estao na lista DEAD_SELECTORS abaixo — nada e
// inferido/automatico na hora de decidir o que apagar.
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "src", "styles.css");

const DEAD_SELECTORS = new Set([
  ".login-brand img",
  ".login-message h1 span",
  ".login-message p",
  ".login-pulse small",
  ".login-panel form",
  ".login-global-topbar",
  ".login-headline-block h2",
  ".login-headline-block p",
  ".login-role-pills",
  ".login-role-pills span",
  ".login-trust-strip",
  ".login-trust-strip b",
  ".login-trust-strip small",
  ".sso-divider",
  ".login-assurance-row",
  ".login-assurance-row span",
  ".ecosystem-copy p",
  ".ecosystem-core b",
  ".ecosystem-core small",
  ".login-pulse.compact",
  ".login-transition-card",
  ".login-transition-card h3",
  ".login-transition-card p",
  ".login-transition-orb",
]);

let css = fs.readFileSync(file, "utf8");
css = css.replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length)); // preserva offsets

let depth = 0;
let mode = "selector";
let selStart = 0;
const spans = [];

for (let i = 0; i < css.length; i++) {
  const ch = css[i];
  if (mode === "selector") {
    if (ch === "{") {
      depth++;
      if (depth === 1) mode = "body";
    } else if (ch === "}") {
      depth--;
    }
  } else {
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const sel = css.slice(selStart, css.indexOf("{", selStart)).trim();
        if (DEAD_SELECTORS.has(sel)) spans.push([selStart, i + 1]);
        selStart = i + 1;
        mode = "selector";
      }
    }
  }
}

const original = fs.readFileSync(file, "utf8");
let removedCount = 0;
let result = original;
// remove de tras pra frente pra nao invalidar os indices anteriores
for (const [start, end] of spans.sort((a, b) => b[0] - a[0])) {
  result = result.slice(0, start) + result.slice(end);
  removedCount++;
}

fs.writeFileSync(file, result, "utf8");
console.log(`Removidas ${removedCount} de ${DEAD_SELECTORS.size} regras mortas de styles.css.`);
if (removedCount !== DEAD_SELECTORS.size) {
  console.log("ATENCAO: nem todos os seletores da lista foram encontrados/removidos — confira manualmente.");
}
