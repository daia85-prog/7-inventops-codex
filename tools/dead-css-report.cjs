// Script de analise (nao faz parte do check:quality) - lista seletores
// top-level de styles.css que sao totalmente sombreados por
// premium-overrides.css (mesmo seletor, premium cobre todas as props).
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "src");

function parseTopLevelRules(css) {
  // remove comentarios
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  let depth = 0;
  let buf = "";
  let selectorBuf = "";
  let mode = "selector"; // selector | body
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (mode === "selector") {
      if (ch === "{") {
        depth++;
        if (depth === 1) { mode = "body"; buf = ""; }
        else { selectorBuf += ch; }
      } else if (ch === "}") {
        depth--;
      } else {
        selectorBuf += ch;
      }
    } else {
      if (ch === "{") { depth++; buf += ch; }
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const sel = selectorBuf.trim();
          if (sel && !sel.startsWith("@")) {
            const props = new Set(
              buf.split(";").map((p) => p.split(":")[0].trim()).filter(Boolean)
            );
            rules.push({ selector: sel, props });
          }
          selectorBuf = "";
          mode = "selector";
        } else {
          buf += ch;
        }
      } else {
        buf += ch;
      }
    }
  }
  return rules;
}

const stylesCss = fs.readFileSync(path.join(dir, "styles.css"), "utf8");
const premiumCss = fs.readFileSync(path.join(dir, "premium-overrides.css"), "utf8");

const stylesRules = parseTopLevelRules(stylesCss);
const premiumRules = parseTopLevelRules(premiumCss);

const premiumBySelector = new Map();
for (const r of premiumRules) {
  if (!premiumBySelector.has(r.selector)) premiumBySelector.set(r.selector, new Set());
  for (const p of r.props) premiumBySelector.get(r.selector).add(p);
}

const fullyDead = [];
const partiallyShadowed = [];
const unique = [];

for (const r of stylesRules) {
  const premiumProps = premiumBySelector.get(r.selector);
  if (!premiumProps) { unique.push(r.selector); continue; }
  const uncovered = [...r.props].filter((p) => !premiumProps.has(p));
  if (uncovered.length === 0) fullyDead.push(r.selector);
  else partiallyShadowed.push({ selector: r.selector, uncovered });
}

console.log(`Top-level rules em styles.css: ${stylesRules.length}`);
console.log(`\n=== TOTALMENTE MORTAS (seguro remover) — ${fullyDead.length} ===`);
fullyDead.forEach((s) => console.log("  " + s));
console.log(`\n=== PARCIALMENTE SOMBREADAS (NAO remover sem revisar) — ${partiallyShadowed.length} ===`);
partiallyShadowed.forEach((r) => console.log(`  ${r.selector}  [falta cobrir: ${r.uncovered.join(", ")}]`));
console.log(`\n=== SEM DUPLICATA em premium (ativas, nao tocar) — ${unique.length} ===`);
unique.forEach((s) => console.log("  " + s));
