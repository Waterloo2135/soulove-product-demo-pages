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
  await page.waitForTimeout(1600);
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-dots.png" });
  const multi = await page.locator(".phone .player-live-stack").evaluate((el) => ({
    dots: el.querySelectorAll(".player-live-dots i").length,
    on: el.querySelectorAll(".player-live-dots i.on").length,
    peek: !!el.querySelector(".player-live-peek"),
    aria: el.getAttribute("aria-label"),
  }));
  await page.waitForTimeout(3200);
  const after = await page.locator(".phone .player-live-stack").evaluate((el) => ({
    aria: el.getAttribute("aria-label"),
    onIndex: [...el.querySelectorAll(".player-live-dots i")].findIndex((i) => i.classList.contains("on")),
  }));
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-dots-2.png" });
  await page.goto("http://127.0.0.1:5173/#/short-drama-watch?id=d4", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".player-live-stack", { timeout: 10000 });
  await page.waitForTimeout(1000);
  const single = await page.locator(".phone .player-live-stack").evaluate((el) => ({
    cls: el.className,
    dots: el.querySelectorAll(".player-live-dots i").length,
  }));
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-dots-single.png" });
  console.log(JSON.stringify({ multi, after, single }));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
