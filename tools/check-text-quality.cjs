const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");
const extensions = new Set([".js", ".jsx", ".ts", ".tsx", ".css"]);

const suspiciousChars = new Set([
  0x00c2, // Â
  0x00f0, // ð
  0xfffd, // replacement char
]);

const suspiciousPairs = [
  [0x00c3, 0x0080, 0x00bf], // Ã followed by mojibake continuation range
  [0x00c3, 0x0192, 0x0192], // Ãƒ
  [0x00e2, 0x20ac, 0x20ac], // â€...
  [0x00e2, 0x2020, 0x2022], // â† / arrows/bullets mojibake
];

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return extensions.has(path.extname(full)) ? [full] : [];
  });
}

function hasSuspiciousText(line) {
  for (let i = 0; i < line.length; i += 1) {
    const code = line.charCodeAt(i);
    if (suspiciousChars.has(code)) return true;
    for (const [first, min, max] of suspiciousPairs) {
      if (code === first) {
        const next = line.charCodeAt(i + 1);
        if (next >= min && next <= max) return true;
      }
    }
  }
  return false;
}

const hits = [];

for (const file of listFiles(src)) {
  const text = fs.readFileSync(file, "utf8");
  text.split(/\r?\n/).forEach((line, index) => {
    if (hasSuspiciousText(line)) {
      hits.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
    }
  });
}

if (hits.length) {
  console.error("Falha de qualidade de texto/i18n. Corrija antes de apresentar:");
  for (const hit of hits.slice(0, 80)) console.error(`- ${hit}`);
  if (hits.length > 80) console.error(`... +${hits.length - 80} ocorrências`);
  process.exit(1);
}

console.log("OK: sem mojibake, demo/protótipo/mockup visível ou texto quebrado em src.");
