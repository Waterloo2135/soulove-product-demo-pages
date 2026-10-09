const { spawn } = require("child_process");
const fs = require("fs");
const gh = require("path").join("share", "bin", "gh.exe");
const child = spawn(gh, ["auth", "login", "-h", "github.com", "-p", "https", "-w"], {
  stdio: ["ignore", "pipe", "pipe"],
});
fs.writeFileSync("share/gh-login-pid.txt", String(child.pid));
let out = "";
function h(b) {
  const s = b.toString();
  out += s;
  fs.writeFileSync("share/gh-login.txt", out);
}
child.stdout.on("data", h);
child.stderr.on("data", h);
child.on("exit", (c) => {
  fs.writeFileSync("share/gh-login-exit.txt", String(c));
  // after login, mark
  try {
    const st = require("child_process").execFileSync(gh, ["auth", "status"], { encoding: "utf8" });
    fs.writeFileSync("share/gh-auth-status.txt", st);
  } catch (e) {
    fs.writeFileSync("share/gh-auth-status.txt", String(e.stderr || e.message));
  }
});
// keep alive 10 min
setTimeout(() => {}, 600000);
