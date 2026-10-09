const { spawn } = require("child_process");
const fs = require("fs");
const gh = "share\\\\bin\\\\gh.exe";
const child = spawn(gh, ["auth", "login", "-h", "github.com", "-p", "https", "-w"], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: false,
});
let out = "";
function h(b) {
  const s = b.toString();
  out += s;
  fs.writeFileSync("share/gh-login.txt", out);
  process.stdout.write(s);
}
child.stdout.on("data", h);
child.stderr.on("data", h);
setTimeout(() => process.exit(0), 20000);
