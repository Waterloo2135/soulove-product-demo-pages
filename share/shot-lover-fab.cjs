const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/home", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(800);
  await page.locator(".phone .home-tab", { hasText: "My Lover" }).click();
  await page.waitForTimeout(500);
  const phone = page.locator(".phone");
  await phone.screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/lover-fab.png" });
  const metrics = await page.locator(".phone .home-lover-create").evaluate((el) => {
    const r = el.getBoundingClientRect();
    const tab = document.querySelector(".phone .tabbar").getBoundingClientRect();
    return {
      btnBottomToPhone: Math.round(document.querySelector(".phone").getBoundingClientRect().bottom - r.bottom),
      gapToTab: Math.round(tab.top - r.bottom),
    };
  });
  console.log(JSON.stringify(metrics));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
