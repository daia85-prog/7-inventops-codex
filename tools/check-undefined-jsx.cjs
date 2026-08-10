const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "src");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsx"));

const JS_GLOBALS = new Set([
  "window", "document", "console", "Math", "JSON", "Object", "Array", "String", "Number",
  "Boolean", "Date", "Promise", "Set", "Map", "navigator", "location", "sessionStorage",
  "localStorage", "fetch", "Intl", "URL", "Blob", "FileReader", "setTimeout", "clearTimeout",
  "undefined", "null", "true", "false", "NaN", "Infinity", "e", "event",
]);

let problems = 0;
for (const file of files) {
  const full = path.join(dir, file);
  const src = fs.readFileSync(full, "utf8");

  const declared = new Set(JS_GLOBALS);

  const importBlockRe = /import\s*\{([^}]+)\}\s*from\s*["'][^"']+["']/g;
  let m;
  while ((m = importBlockRe.exec(src))) {
    m[1].split(",").forEach((n) => {
      const name = n.trim().split(/\s+as\s+/).pop().trim();
      if (name) declared.add(name);
    });
  }
  const defaultImportRe = /import\s+([A-Za-z0-9_]+)\s+from/g;
  while ((m = defaultImportRe.exec(src))) declared.add(m[1]);

  // declaracoes de qualquer case (componentes, handlers locais, variaveis)
  const localDeclRe = /(?:const|let|var|function)\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  while ((m = localDeclRe.exec(src))) declared.add(m[1]);

  // parametros de funcao/arrow e destructuring simples: (a,b)=>, ({a,b})=>, function f(a,b)
  const paramRe = /(?:\(([^()]*)\)\s*=>|function\s*[A-Za-z0-9_]*\s*\(([^()]*)\))/g;
  while ((m = paramRe.exec(src))) {
    const raw = (m[1] || m[2] || "");
    raw.replace(/[{}[\]]/g, "").split(",").forEach((p) => {
      const name = p.trim().split("=")[0].trim().replace(/^\.\.\./, "");
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) declared.add(name);
    });
  }

  const used = new Set();

  const tagRe = /<([A-Z][A-Za-z0-9]*)/g;
  while ((m = tagRe.exec(src))) used.add(m[1]);

  const hookRe = /[^A-Za-z0-9_.](use[A-Z][A-Za-z0-9]*)\s*\(/g;
  while ((m = hookRe.exec(src))) used.add(m[1]);

  // handlers JSX com referencia direta a um identificador: onClick={nomeDaFuncao}
  // (ignora arrow inline "={()=>" e chamadas "={algo(" que nao sao o alvo deste check)
  const handlerRe = /\son[A-Z][A-Za-z]*=\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}/g;
  while ((m = handlerRe.exec(src))) used.add(m[1]);

  const missing = [...used].filter((n) => !declared.has(n));
  if (missing.length) {
    problems += missing.length;
    console.log(file + ": MISSING -> " + missing.join(", "));
  }
}
console.log(problems === 0 ? "OK: nenhum componente/icone/hook/handler sem import ou declaracao." : `TOTAL: ${problems} possiveis identificadores sem import/declaracao.`);
