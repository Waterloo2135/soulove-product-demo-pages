const fs = require("fs");
const path = require("path");

const dist = path.join(process.cwd(), "dist");
const htmlPath = path.join(dist, "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
const js = fs.readFileSync(path.join(dist, "assets", "app.js"), "utf8");
const css = fs.readFileSync(path.join(dist, "assets", "app.css"), "utf8");

// inline local public images used by demo as data URIs if small
const publicDir = path.join(dist, "short-drama");
const replacements = {};
if (fs.existsSync(publicDir)) {
  for (const name of fs.readdirSync(publicDir)) {
    const fp = path.join(publicDir, name);
    const st = fs.statSync(fp);
    if (!st.isFile() || st.size > 400000) continue;
    const ext = path.extname(name).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" :
      ext === ".svg" ? "image/svg+xml" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      ext === ".webp" ? "image/webp" : null;
    if (!mime) continue;
    const b64 = fs.readFileSync(fp).toString("base64");
    const data = `data:${mime};base64,${b64}`;
    replacements[`./short-drama/${name}`] = data;
    replacements[`/short-drama/${name}`] = data;
    replacements[`short-drama/${name}`] = data;
  }
}

let jsOut = js;
let cssOut = css;
for (const [from, to] of Object.entries(replacements)) {
  // careful replace of path strings in bundle
  jsOut = jsOut.split(JSON.stringify(from)).join(JSON.stringify(to));
  jsOut = jsOut.split(`"${from}"`).join(`"${to}"`);
  jsOut = jsOut.split(`'${from}'`).join(`'${to}'`);
  cssOut = cssOut.split(from).join(to);
}

const single = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Soulove Product Demo</title>
  <style>
${cssOut}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
${jsOut}
  </script>
</body>
</html>
`;

const outDir = path.join(process.cwd(), "share", "single");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "index.html");
fs.writeFileSync(outFile, single);
console.log("wrote", outFile, "bytes", single.length);
