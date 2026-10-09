const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/short-drama-watch?id=d1", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".player-live-ava", { timeout: 10000 });
  await page.waitForTimeout(1500);
  const phone = page.locator(".phone");
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/player-live-1.png" });
  await page.waitForTimeout(3000);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/player-live-2.png" });
  const aria = await page.locator(".player-live-ava").getAttribute("aria-label");
  await page.locator(".player-live-ava").click();
  await page.waitForTimeout(900);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/player-live-click.png" });
  console.log(JSON.stringify({ url: page.url(), aria, hash: await page.evaluate(() => location.hash) }));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
