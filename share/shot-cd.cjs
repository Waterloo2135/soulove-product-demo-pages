const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/character-detail?id=maya", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".phone .cd-action", { timeout: 10000 });
  await page.waitForTimeout(1800);
  const phone = page.locator(".phone");
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/cd-bottom.png" });
  const buttons = await page.locator(".phone .cd-action").evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim().replace(/\\s+/g, " "), w: Math.round(r.width), h: Math.round(r.height) };
    })
  );
  await page.locator(".phone .cd-action", { hasText: "Chat Now" }).click();
  await page.waitForTimeout(700);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/cd-chat.png" });
  console.log(JSON.stringify({ buttons, hash: await page.evaluate(() => location.hash) }));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
