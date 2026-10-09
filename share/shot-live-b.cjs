const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  const phone = page.locator(".phone");
  await page.goto("http://127.0.0.1:5173/#/short-drama-watch?id=d1", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".player-live-stack.multi", { timeout: 10000 });
  await page.waitForTimeout(1800);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-a1.png" });
  await page.locator(".phone .player-live-stack").click();
  await page.waitForTimeout(700);
  const afterClick = await page.evaluate(() => location.hash);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-click.png" });
  await page.goto("http://127.0.0.1:5173/#/short-drama-watch?id=d2", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".player-live-stack", { timeout: 10000 });
  await page.waitForTimeout(1200);
  const single = await page.locator(".phone .player-live-stack").evaluate((el) => ({
    cls: el.className,
    peek: !!el.querySelector(".player-live-peek"),
    aria: el.getAttribute("aria-label"),
  }));
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-single.png" });
  console.log(JSON.stringify({ afterClick, single }));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
