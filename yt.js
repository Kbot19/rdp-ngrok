const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.tiktok.com/login/phone-or-email/email');

  /*await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'karimfreegg@gmail.com');
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.type('input[type="password"]', 'karim2021@11');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.evaluate(() => {
    document.querySelector('#loginContainer > div.tiktok-aa97el-DivLoginContainer.exd0a430 > form > button').click();
  });

  //await page.waitForNavigation();
  await page.goto('https://www.tiktok.com/foryou?lang=en');*/
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
