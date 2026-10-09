const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  const phone = page.locator(".phone");
  await page.goto("http://127.0.0.1:5173/#/home", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(1200);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/home-tabs.png" });
  await page.locator(".phone .home-tab", { hasText: "My Lover" }).click();
  await page.waitForTimeout(600);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/home-lover.png" });
  await page.locator(".phone .tab", { hasText: "Drama" }).click();
  await page.waitForTimeout(800);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/tab-drama.png" });
  await page.goto("http://127.0.0.1:5173/#/drama-remix?id=d1", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(800);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/insp-lead.png" });
  const tabs = await page.evaluate(() => null);
  console.log("ok");
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
