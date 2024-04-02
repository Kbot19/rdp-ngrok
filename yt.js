const puppeteer = require('puppeteer');

(async () => {
  const totalPageCount = 500;

  let pageCount = 0;
  let browser;

  while (pageCount < totalPageCount) {
    if (!browser) {
      browser = await puppeteer.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.goto('https://massar.men.gov.ma');
    pageCount++;
    
    setInterval(async () => {
      await page.reload();
    }, 1000);
  }

  console.log(`تم الدخول إلى ${pageCount} صفحة وتم تحديث كل صفحة كل ثانية.`);
})();
