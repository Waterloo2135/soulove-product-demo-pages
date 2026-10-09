const { spawn } = require("child_process");
const fs = require("fs");
const out = fs.createWriteStream("share/tunnel-log.txt");
const child = spawn("npx.cmd", ["--yes", "cloudflared", "tunnel", "--url", "http://127.0.0.1:4177"], {
  cwd: process.cwd(),
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
});
fs.writeFileSync("share/tunnel-pid.txt", String(child.pid));
function handle(buf) {
  const s = buf.toString();
  out.write(s);
  process.stdout.write(s);
  const m = s.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (m) {
    fs.writeFileSync("share/public-url.txt", m[0] + "\n");
    console.log("\nPUBLIC_URL=" + m[0]);
  }
}
child.stdout.on("data", handle);
child.stderr.on("data", handle);
setTimeout(() => {}, 120000);
