const puppeteer = require('puppeteer');

(async () => {
  const totalPageCount = 500000;

  let pageCount = 0;
  let browser;

  while (pageCount < totalPageCount) {
    if (!browser) {
      browser = await puppeteer.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.goto('https://massar.men.gov.ma');
    pageCount++;
  }

  console.log(`تم الدخول إلى ${pageCount} صفحة.`);
})();
