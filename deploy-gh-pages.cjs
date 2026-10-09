const { execFileSync, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const gh = path.join("share", "bin", "gh.exe");

function sh(cmd) {
  console.log(">", cmd);
  return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}
function ghcmd(args) {
  console.log("> gh", args.join(" "));
  return execFileSync(gh, args, { encoding: "utf8" });
}

// ensure build
sh("npm run build");

const status = ghcmd(["auth", "status"]);
console.log(status);
const user = ghcmd(["api", "user", "-q", ".login"]).trim();
console.log("user", user);
const repo = "soulove-product-demo-pages";

// create repo if needed
try {
  ghcmd(["repo", "view", `${user}/${repo}`]);
  console.log("repo exists");
} catch {
  ghcmd(["repo", "create", repo, "--public", "--description", "Soulove product demo (Remix)", "--confirm"]);
}

// publish dist via git worktree-like temp
const work = path.join("share", "gh-pages-work");
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
// copy dist
function cp(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const e of fs.readdirSync(a, { withFileTypes: true })) {
    const s = path.join(a, e.name), d = path.join(b, e.name);
    e.isDirectory() ? cp(s, d) : fs.copyFileSync(s, d);
  }
}
cp("dist", work);
fs.writeFileSync(path.join(work, ".nojekyll"), "");
fs.writeFileSync(
  path.join(work, "README.md"),
  `# Soulove Product Demo\n\nOpen the GitHub Pages URL after deploy.\n`
);

sh(`git -C "${work}" init`);
sh(`git -C "${work}" checkout -b gh-pages`);
sh(`git -C "${work}" add -A`);
sh(`git -C "${work}" -c user.email="demo@soulove.local" -c user.name="Soulove Demo" commit -m "deploy demo"`);
// set remote and push with gh token from gh auth
const token = ghcmd(["auth", "token"]).trim();
const remote = `https://x-access-token:${token}@github.com/${user}/${repo}.git`;
try { sh(`git -C "${work}" remote remove origin`); } catch {}
sh(`git -C "${work}" remote add origin ${remote}`);
sh(`git -C "${work}" push -f origin gh-pages`);

// enable pages
try {
  ghcmd([
    "api",
    `-X`,
    `PUT`,
    `repos/${user}/${repo}/pages`,
    `-f`,
    `build_type=legacy`,
    `-f`,
    `source[branch]=gh-pages`,
    `-f`,
    `source[path]=/`,
  ]);
} catch (e) {
  console.log("pages enable note", e.message);
  try {
    ghcmd([
      "api",
      `-X`,
      `POST`,
      `repos/${user}/${repo}/pages`,
      `-f`,
      `build_type=legacy`,
      `-f`,
      `source[branch]=gh-pages`,
      `-f`,
      `source[path]=/`,
    ]);
  } catch (e2) {
    console.log("pages post note", e2.message);
  }
}

const url = `https://${user}.github.io/${repo}/`;
fs.writeFileSync("share/fixed-url.txt", url + "\n");
console.log("FIXED_URL", url);
