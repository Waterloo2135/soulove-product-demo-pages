const { spawn } = require("child_process");
const fs = require("fs");
const log = fs.createWriteStream("share/deploy-log.txt");
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: process.cwd(), shell: true, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    const handle = (b) => {
      const s = b.toString();
      out += s;
      log.write(s);
      process.stdout.write(s);
    };
    child.stdout.on("data", handle);
    child.stderr.on("data", handle);
    child.on("exit", (c) => resolve({ code: c, out }));
  });
}
(async () => {
  // Netlify deploy without account can use draft URLs via CLI with auth token if present
  // Try vercel first (often works with --yes for guest in some setups)
  let r = await run("npx.cmd", ["--yes", "netlify-cli@17", "deploy", "--dir=dist", "--prod", "--message", "soulove-remix-demo"]);
  fs.writeFileSync("share/deploy-result.txt", r.out);
  const urls = [...r.out.matchAll(/https:\/\/[a-zA-Z0-9._\-]+\.(netlify\.app|vercel\.app|surge\.sh)[^\s]*/g)].map(m => m[0]);
  if (urls.length) fs.writeFileSync("share/fixed-url.txt", urls.join("\n"));
  console.log("DONE code", r.code, "urls", urls);
  process.exit(r.code || 0);
})();
