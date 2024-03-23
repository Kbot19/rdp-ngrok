const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.facebook.com/r.php');

  await page.waitForSelector('input[name=firstname]');
  await page.type('input[name=firstname]', 'Karim');
  await page.type('input[name=lastname]', 'Elyamani');
  await page.type('input[name=reg_email__]', 'karimfreeg@gmail.com');
  await page.type('input[name=reg_email_confirmation__]', 'karimfreeg@gmail.com');
  await page.type('input[name=reg_passwd__]', 'Karim2021@11');
  await page.select('select[name=birthday_day]', '1');
  await page.select('select[name=birthday_month]', '1');
  await page.select('select[name=birthday_year]', '1999');

  // تحديد الجنس
  const elements = await page.evaluate(() => document.querySelectorAll('#u_0_5'))
  const firstElementId = await page.evaluate(
    () => document.querySelector('#u_0_5').id
  );
  const lastTwoDigits = firstElementId.slice(-2);

  const selector = `#u_0_5_${lastTwoDigits}`;
  await page.click(selector);

  // الضغط على زر Submit
  await page.waitForSelector('button[type=submit][name=websubmit]');
  await page.click('button[type=submit][name=websubmit]');

  // التقاط لقطة الشاشة
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
