const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const { chromium } = require('playwright')
puppeteer.use(stealthPlugin());

(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://www.tiktok.com/login/phone-or-email/email');

  await page.waitForSelector('#loginContainer > div.tiktok-aa97el-DivLoginContainer.exd0a430 > form > div.tiktok-q83gm2-DivInputContainer.etcs7ny0 > input');

  // Type the specified email address into the email input field
  await page.type('#loginContainer > div.tiktok-aa97el-DivLoginContainer.exd0a430 > form > div.tiktok-q83gm2-DivInputContainer.etcs7ny0 > input', 'karimfreegg@gmail.com');

  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.type('input[type="password"]', 'karim2021@11');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.click('button[type="submit"]');
  
  await new Promise(resolve => setTimeout(resolve, 15000));
  //await page.goto('https://www.tiktok.com/');
  //await page.waitForNavigation();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();
