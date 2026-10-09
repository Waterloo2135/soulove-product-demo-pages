const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/short-drama-watch?id=d1", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(".player-live-stack.multi", { timeout: 10000 });
  await page.waitForTimeout(1600);
  const phone = page.locator(".phone");
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/live-right.png" });
  const info = await page.locator(".phone .player-live-stack").evaluate((el) => {
    const peek = el.querySelector(".player-live-peek");
    const front = el.querySelector(".player-live-window");
    const pr = peek.getBoundingClientRect();
    const fr = front.getBoundingClientRect();
    return {
      aria: el.getAttribute("aria-label"),
      waves: el.querySelectorAll(".player-live-wave").length,
      peekW: Math.round(pr.width),
      frontW: Math.round(fr.width),
      scale: +(pr.width / fr.width).toFixed(2),
      peekRightOfFront: Math.round(pr.right - fr.right),
    };
  });
  console.log(JSON.stringify(info));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
