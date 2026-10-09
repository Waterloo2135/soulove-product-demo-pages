const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/drama-remix?id=d1", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".rx-ideas-lead", { timeout: 10000 });
  await page.waitForTimeout(600);
  const text = await page.locator(".phone .rx-ideas-lead").innerText();
  await page.locator(".phone").screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/insp-lead.png" });
  console.log(JSON.stringify({ text }));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
