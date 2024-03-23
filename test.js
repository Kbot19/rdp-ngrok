const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://smailpro.com/temp-gmail');
  
  // انتظر حتى يتم تحميل الصفحة بالكامل
  await page.waitForSelector('.ml-2');

  // انقر على div المحدد
  await page.click('.ml-2 div');

  // انتظر حتى يتم عرض العنوان البريدي
  await page.waitForSelector('.ml-2 address');

  // استخراج نص البريد الإلكتروني وطباعته
  const temporaryEmail = await page.$eval('.ml-2 address', element => element.textContent.trim());
  console.log('Temporary Email:', temporaryEmail);

  // قم بإغلاق المتصفح بعد الانتهاء
  await browser.close();
})();
