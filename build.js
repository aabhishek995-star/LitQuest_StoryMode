const fs = require("fs");
const path = require("path");
const out = path.join(__dirname, "www");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const item of ["index.html", "manifest.json", "sw.js", "css", "js", "data", "assets"]) {
  fs.cpSync(path.join(__dirname, item), path.join(out, item), { recursive: true });
}
console.log("LitQuest web assets copied to www/");
