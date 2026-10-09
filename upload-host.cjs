const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { execFileSync } = require("child_process");

const file = path.join(process.cwd(), "share", "single", "index.html");
const buf = fs.readFileSync(file);
console.log("file size", buf.length);

function tryCurl(args) {
  try {
    const out = execFileSync("curl.exe", args, { encoding: "utf8", maxBuffer: 10_000_000 });
    return out.trim();
  } catch (e) {
    return "ERR:" + (e.stderr || e.message);
  }
}

// 1) catbox
let r = tryCurl([
  "-s", "-F", `reqtype=fileupload`, "-F", `fileToUpload=@${file}`,
  "https://catbox.moe/user/api.php",
]);
console.log("catbox:", r);
if (/^https?:\/\//.test(r)) {
  fs.writeFileSync("share/fixed-url.txt", r + "\n");
  process.exit(0);
}

// 2) litterbox 1h - not fixed
// 3) 0x0.st
r = tryCurl(["-s", "-F", `file=@${file};filename=soulove-demo.html`, "https://0x0.st"]);
console.log("0x0:", r);
if (/^https?:\/\//.test(r)) {
  fs.writeFileSync("share/fixed-url.txt", r + "\n");
  process.exit(0);
}

// 4) transfer.sh
r = tryCurl(["-s", "--upload-file", file, "https://transfer.sh/soulove-demo.html"]);
console.log("transfer:", r);
if (/^https?:\/\//.test(r)) {
  fs.writeFileSync("share/fixed-url.txt", r + "\n");
  process.exit(0);
}

// 5) file.io
r = tryCurl(["-s", "-F", `file=@${file}`, "https://file.io"]);
console.log("fileio:", r);

fs.writeFileSync("share/upload-debug.txt", "failed\n");
process.exit(1);
