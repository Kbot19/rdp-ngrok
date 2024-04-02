const puppeteer = require('puppeteer');

(async () => {
  const totalPageCount = 500;
  const maxPagesPerBrowser = 100;

  let pageCount = 0;
  let browserCount = 0;

  while (pageCount < totalPageCount) {
    const browser = await puppeteer.launch({ headless: true });
    const promises = [];

    for (let i = 0; i < maxPagesPerBrowser && pageCount < totalPageCount; i++) {
      promises.push(browser.newPage().then(async (page) => {
        await page.goto('https://massar.men.gov.ma');
        pageCount++;
      }));
    }

    await Promise.all(promises);
    await browser.close();
    browserCount++;
  }

  console.log(`تم الدخول إلى ${pageCount} صفحة باستخدام ${browserCount} متصفح(ين).`);
})();
