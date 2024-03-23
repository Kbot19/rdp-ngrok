const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://m.facebook.com/r.php';

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
  await page.type('input[name=lastname]', 'Al yamani');
  await page.type('input[name=reg_email__]', '+212 605-685904');
  //await page.type('input[name=reg_email_confirmation__]', '+212 605-685904');
  await page.type('input[name=reg_passwd__]', 'Karim2021@11');
  await page.select('select[name=birthday_day]', '1');
  await page.select('select[name=birthday_month]', '1');
  await page.select('select[name=birthday_year]', '1999');

  const content = await page.content();
  const cheriEx = cheerio.load(content);
  let id = '';
  let submitId = '';
  cheriEx('input[id]').each((index, element) => {
    const foundId = cheriEx(element).attr('id');
    if (foundId && foundId.startsWith('u_0_5_')) {
      console.log('Found ID:', foundId);
      id = foundId;
    }
  });

  cheriEx('button[name=websubmit]').each((index, element) => {
    const foundSubmitId = cheriEx(element).attr('id');
    if (foundSubmitId && foundSubmitId.startsWith('u_0_s_')) {
      console.log('Found Submit ID:', foundSubmitId);
      submitId = foundSubmitId;
    }
  });

  if (id !== '' && submitId !== '') {
    await page.click(`#${id}`);
    console.log('Clicked on ID:', id);
    await page.click(`#${submitId}`);
    console.log('Clicked on Submit ID:', submitId);
    await page.waitForNavigation(); // انتظار التنقل إلى الصفحة الجديدة
    console.log('Navigated to new page:', page.url());
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log('Screenshot taken.');
  } else {
    console.log('ID or Submit ID not found.');
  }

  await browser.close();
})();
