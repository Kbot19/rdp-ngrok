const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(stealthPlugin());
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.goto('https://accounts.google.com/v3/signin/identifier?hl=en-gb&ifkv=ARZ0qKJp3mev17CcDjjuQzxHizfr4-A2bWBdcjnd__Z9q8Xn-L_3BXGKXS-KWjTof5gi2ecC30MRwA&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1543424507%3A1711009155669812&theme=mn&ddm=0');

  await page.waitForSelector('input[name="identifier"]');

  await page.type('input[name="identifier"]', 'karimfreegg@gmail.com');

  await new Promise(resolve => setTimeout(resolve, 5000));

  await page.keyboard.press('Enter');
  //await page.click('button[type="button"]');

  await page.waitForNavigation();

  /*await new Promise(resolve => setTimeout(resolve, 300));

  await page.keyboard.press('Enter');

  await page.waitForSelector('input[name="identifier"]');

  await page.type('input[name="identifier"]', 'karimfreegg@gmail.com');

  await new Promise(resolve => setTimeout(resolve, 5000));

  await page.keyboard.press('Enter');*/

  /*await new Promise(resolve => setTimeout(resolve, 10000));

  await page.type('input[type="password"]', 'karim20021@x1');

  // النقر على زر "Next" بعد إدخال كلمة المرور
  await page.click('button[type="button"]');*/

  await new Promise(resolve => setTimeout(resolve, 20000));

  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
