const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "src");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsx"));

let problems = 0;
for (const file of files) {
  const full = path.join(dir, file);
  const src = fs.readFileSync(full, "utf8");

  const imported = new Set();
  const importBlockRe = /import\s*\{([^}]+)\}\s*from\s*["'][^"']+["']/g;
  let m;
  while ((m = importBlockRe.exec(src))) {
    m[1].split(",").forEach((n) => {
      const name = n.trim().split(/\s+as\s+/).pop().trim();
      if (name) imported.add(name);
    });
  }
  const defaultImportRe = /import\s+([A-Za-z0-9_]+)\s+from/g;
  while ((m = defaultImportRe.exec(src))) imported.add(m[1]);

  const localDeclRe = /(?:const|function|class)\s+([A-Z][A-Za-z0-9_]*)/g;
  while ((m = localDeclRe.exec(src))) imported.add(m[1]);

  const tagRe = /<([A-Z][A-Za-z0-9]*)/g;
  const used = new Set();
  while ((m = tagRe.exec(src))) used.add(m[1]);

  const hookRe = /[^A-Za-z0-9_.](use[A-Z][A-Za-z0-9]*)\s*\(/g;
  while ((m = hookRe.exec(src))) used.add(m[1]);

  const missing = [...used].filter((n) => !imported.has(n));
  if (missing.length) {
    problems += missing.length;
    console.log(file + ": MISSING -> " + missing.join(", "));
  }
}
console.log(problems === 0 ? "OK: nenhum componente/icone/hook sem import." : `TOTAL: ${problems} possiveis identificadores sem import.`);
