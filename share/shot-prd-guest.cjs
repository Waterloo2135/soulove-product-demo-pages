const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/home", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(600);
  await page.locator(".lab button", { hasText: "guest" }).click();
  await page.locator(".phone .home-tab", { hasText: "My Lover" }).click();
  await page.waitForTimeout(400);
  await page.locator(".phone").screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/prd-my-lover-guest.png" });
  await browser.close();
  console.log("ok");
})().catch((e) => { console.error(e); process.exit(1); });
