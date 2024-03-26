const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://youtu.be/r-2bvfWGuQk?si=JmnSfb7zkQMatFUQ');
  
  // انتظر حتى يتم العثور على العنصر الذي يحتوي على مدة الفيديو
  await page.waitForSelector('.time-second');
  
  // استخراج مدة الفيديو
  const durationElement = await page.$('.time-second');
  const durationText = await page.evaluate(durationElement => durationElement.textContent, durationElement);
  console.log('مدة الفيديو:', durationText);
  
  await browser.close();
})();
