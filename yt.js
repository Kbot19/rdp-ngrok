const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=https%3A%2F%2Faccounts.google.com%2Fv3%2Fsignin%2Fidentifier%3Fcontinue%3Dhttps%253A%252F%252Faccounts.google.com%252F%26followup%3Dhttps%253A%252F%252Faccounts.google.com%252F%26ifkv%3DARZ0qKK1GagRHSotRghAtRp4s9jV4jM7AM_7OCg5uW3vTlwrw50CYCcgi2HH88rjLwKuZVz-ArH0%26passive%3D1209600%26flowName%3DGlifWebSignIn%26flowEntry%3DServiceLogin%26dsh%3DS1577268669%253A1711932089041250%26theme%3Dmn%26ddm%3D0%2F&client=webapp');

  await page.waitForSelector('input[name="identifier"]');

  await page.type('input[name="identifier"]', 'karimfreegg@gmail.com');

  await new Promise(resolve => setTimeout(resolve, 5000));

  await page.keyboard.press('Enter');
  //await page.click('button[type="button"]');

  //await page.waitForNavigation();

  /*await new Promise(resolve => setTimeout(resolve, 300));

  await page.keyboard.press('Enter');

  await page.waitForSelector('input[name="identifier"]');

  await page.type('input[name="identifier"]', 'karimfreegg@gmail.com');

  await new Promise(resolve => setTimeout(resolve, 5000));

  await page.keyboard.press('Enter');*/

  await new Promise(resolve => setTimeout(resolve, 10000));

  await page.type('input[type="password"]', 'karim20021@x1');

  // النقر على زر "Next" بعد إدخال كلمة المرور
  await page.keyboard.press('Enter');

  await new Promise(resolve => setTimeout(resolve, 20000));

  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
