const { spawn } = require("child_process");
const fs = require("fs");
const child = spawn("npx.cmd", ["--yes", "wrangler@3.114.0", "login"], {
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
  cwd: process.cwd(),
});
let out = "";
const handle = (b) => {
  const s = b.toString();
  out += s;
  process.stdout.write(s);
  fs.writeFileSync("share/wrangler-login.txt", out);
  const m = s.match(/https:\/\/[^\s]+/);
  if (m) fs.writeFileSync("share/wrangler-login-url.txt", m[0]);
};
child.stdout.on("data", handle);
child.stderr.on("data", handle);
setTimeout(() => {
  console.log("timeout waiting login");
  process.exit(0);
}, 25000);
