const { spawn } = require("child_process");
const fs = require("fs");
const child = spawn("npx.cmd", ["--yes", "localtunnel", "--port", "4177", "--subdomain", "soulove-remix-demo"], {
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
  detached: true,
});
fs.writeFileSync("share/lt-pid.txt", String(child.pid));
let out = "";
function h(b) {
  const s = b.toString();
  out += s;
  fs.writeFileSync("share/lt-log.txt", out);
  const m = s.match(/https?:\/\/[^\s]+/);
  if (m) fs.writeFileSync("share/fixed-url.txt", m[0].trim() + "\n");
}
child.stdout.on("data", h);
child.stderr.on("data", h);
child.unref();
setTimeout(() => process.exit(0), 15000);
