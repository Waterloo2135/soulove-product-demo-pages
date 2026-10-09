const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  const phone = page.locator(".phone");
  const out = "C:/Users/admin/Documents/New project/soulove-product-demo/share/prd-";
  await page.goto("http://127.0.0.1:5173/#/home", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(1000);
  await phone.screenshot({ path: out + "home-5tab.png" });
  await page.locator(".phone .home-tab", { hasText: "My Lover" }).click();
  await page.waitForTimeout(400);
  await phone.screenshot({ path: out + "my-lover.png" });
  await page.locator(".phone .tab", { hasText: "Drama" }).click();
  await page.waitForTimeout(700);
  await phone.screenshot({ path: out + "drama.png" });
  await page.locator(".lab button", { hasText: "可见" }).click();
  await page.waitForTimeout(400);
  await phone.screenshot({ path: out + "home-4tab.png" });
  const tabs4 = await page.locator(".phone .tab").count();
  await page.locator(".phone .home-tab", { hasText: "My Lover" }).click();
  await page.waitForTimeout(300);
  await phone.screenshot({ path: out + "my-lover-4tab.png" });
  console.log(JSON.stringify({ tabs4 }));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
