const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://smailpro.com/temp-gmail');
  
  await page.waitForSelector('.ml-2');

  await page.click('.ml-2 address');

  await page.waitForTimeout(5000);

  const temporaryEmail = await page.$eval('.ml-2 address', element => element.textContent.trim());
  console.log('Temporary Email:', temporaryEmail);

  await browser.close();
})();
