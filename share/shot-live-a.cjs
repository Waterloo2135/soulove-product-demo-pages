const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/short-drama-watch?id=d1", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".player-live-stack", { timeout: 10000 });
  await page.waitForTimeout(1600);
  const phone = page.locator(".phone");
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-a1.png" });
  const info1 = await page.locator(".phone .player-live-stack").evaluate((el) => ({
    cls: el.className,
    aria: el.getAttribute("aria-label"),
    peek: !!el.querySelector(".player-live-peek"),
    imgs: [...el.querySelectorAll("img")].map((i) => i.src.slice(-30)),
  }));
  await page.waitForTimeout(3200);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-a2.png" });
  const info2 = await page.locator(".phone .player-live-stack").evaluate((el) => ({
    aria: el.getAttribute("aria-label"),
  }));
  const box = await page.locator(".phone .player-live-stack").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 36, box.y + box.height / 2, { steps: 8 });
  await page.waitForTimeout(80);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-drag.png" });
  await page.mouse.up();
  await page.waitForTimeout(400);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-after-swipe.png" });
  console.log(JSON.stringify({ info1, info2, box }, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
