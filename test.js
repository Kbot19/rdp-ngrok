const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.facebook.com/r.php';

async function fetchData(url) {
  const result = await axios.get(url);
  return cheerio.load(result.data);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
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

  const content = await fetchData(url);
  const cheriEx = cheerio.load(content);
  cheriEx('input[id]').each(async (index, element) => {
    const foundId = cheriEx(element).attr('id');
    if (foundId && foundId.startsWith('u_0_5_')) {
      console.log('Found ID:', foundId);
      await page.click(`#${foundId}`);
      console.log('Clicked on ID:', foundId);
    }
  });

  cheriEx('button[name=websubmit]').each(async (index, element) => {
    const foundSubmitId = cheriEx(element).attr('id');
    if (foundSubmitId && foundSubmitId.startsWith('u_0_s_')) {
      console.log('Found Submit ID:', foundSubmitId);
      await page.click(`#${foundSubmitId}`);
      console.log('Clicked on Submit ID:', foundSubmitId);
    }
  });

  console.log('Screenshot taken in headless mode.');

  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();
