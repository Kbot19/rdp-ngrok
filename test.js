const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.facebook.com/r.php';

async function fetchData(url) {
  const result = await axios.get(url);
  return cheerio.load(result.data);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('input[name=firstname]');
  await page.type('input[name=firstname]', 'Karim');
  await page.type('input[name=lastname]', 'Elyamani');
  await page.type('input[name=reg_email__]', 'karimfreeg@gmail.com');
  await page.type('input[name=reg_email_confirmation__]', 'karimfreeg@gmail.com');
  await page.type('input[name=reg_passwd__]', 'Karim2021@11');
  await page.select('select[name=birthday_day]', '1');
  await page.select('select[name=birthday_month]', '1');
  await page.select('select[name=birthday_year]', '1999');

  const content = await page.content();
  const cheriEx = cheerio.load(content);
  cheriEx('input[id]').each(async (index, element) => {
    const foundId = cheriEx(element).attr('id');
    if (foundId && foundId.startsWith('u_0_5_')) {
      console.log('Found ID:', foundId);
      await page.click(`#${foundId}`);
      console.log('Clicked on ID:', foundId);

      await page.waitForSelector('button[type=submit][name=websubmit]');
      await page.click('button[type=submit][name=websubmit]');

      // انتظر حتى تحميل الصفحة الجديدة
      await page.waitForNavigation();

      // التقاط لقطة شاشة بعد تحميل الصفحة الجديدة
      await page.screenshot({ path: 'screenshot.png', fullPage: true });

      await browser.close();
    }
  });
})();