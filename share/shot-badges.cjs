const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
  await page.goto("http://127.0.0.1:5173/#/short-drama", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.evaluate(() => {
    const day = 86400000;
    localStorage.setItem("sl-demo-drama-watched", "1");
    localStorage.setItem("sl-demo-drama-recent", JSON.stringify([
      { id: "d1", at: Date.now() - 3 * day },
      { id: "d3", at: Date.now() - 5 * day },
    ]));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await page.locator(".phone").screenshot({ path: "C:/Users/admin/Documents/New project/soulove-product-demo/share/prd-drama-badges.png" });
  const flags = await page.locator(".phone .drama-flag").allTextContents();
  console.log(JSON.stringify(flags));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
