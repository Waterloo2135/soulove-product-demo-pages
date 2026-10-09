const fs = require("fs");
const block = `

交给用户时**禁止只给纯文本路径**。必须用 Markdown 链接，让用户能点击预览文件、也能打开所在文件夹（含右键打开文件夹）：

1. PRD 文件：\`[文件名](file:///D:/code/soullove-openspec/SL/PRD/[需求名]PRD.md)\`
2. 沟通记录：\`[沟通记录](file:///D:/code/soullove-openspec/SL/PRD/[需求名]-沟通记录.md)\`
3. 文件夹：\`[打开 PRD 文件夹](file:///D:/code/soullove-openspec/SL/PRD/)\`；有配图时再给 \`[打开资源文件夹](file:///D:/code/soullove-openspec/SL/PRD/资源/[需求名]/)\`
4. \`file:///\` 用正斜杠绝对路径；链接文字用文件名或「打开文件夹」，不要只甩反斜杠路径当正文。
`;

function patchSkill(p) {
  let s = fs.readFileSync(p, "utf8");
  if (s.includes("禁止只给纯文本路径")) return p + " skip";
  s = s.replace(
    "不要用 edu-pm 的 HTML PRD 代替 SL 需求正文\n",
    "不要用 edu-pm 的 HTML PRD 代替 SL 需求正文\n" + block
  );
  if (!s.includes("自检里点得开链接") && s.includes("沟通记录只记决策，不重复 PRD")) {
    s = s.replace(
      "沟通记录只记决策，不重复 PRD\n",
      "沟通记录只记决策，不重复 PRD\n- 回复里 PRD/文件夹是可点击的 file:// 链接，不是纯文本路径\n"
    );
  }
  fs.writeFileSync(p, s);
  return p + " ok";
}

console.log(patchSkill("C:/Users/admin/.codex/skills/soulove-prd/SKILL.md"));
const repo = "D:/code/soullove-openspec/SL/skills/soulove-prd/SKILL.md";
if (fs.existsSync(repo)) console.log(patchSkill(repo));

let ag = fs.readFileSync("D:/code/soullove-openspec/SL/AGENTS.md", "utf8");
if (!ag.includes("file:///")) {
  ag += "\n- 交给用户的 PRD 必须用可点击 Markdown 链接（`file:///` 文件 + 文件夹），不要只给无法预览、无法打开文件夹的纯文本路径\n";
  fs.writeFileSync("D:/code/soullove-openspec/SL/AGENTS.md", ag);
  console.log("agents ok");
}
