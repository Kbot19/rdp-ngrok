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

  let idClicked = false;
  cheriEx('input[id]').each(async (index, element) => {
    const foundId = cheriEx(element).attr('id');
    if (foundId && foundId.startsWith('u_0_5_')) {
      console.log('Found ID:', foundId);
      await page.click(`#${foundId}`);
      console.log('Clicked on ID:', foundId);
      idClicked = true;
    }
  });

  let submitIdClicked = false;
  cheriEx('button[name=websubmit]').each(async (index, element) => {
    const foundSubmitId = cheriEx(element).attr('id');
    if (foundSubmitId && foundSubmitId.startsWith('u_0_s_')) {
      console.log('Found Submit ID:', foundSubmitId);
      await page.click(`#${foundSubmitId}`);
      console.log('Clicked on Submit ID:', foundSubmitId);
      submitIdClicked = true;
    }
  });

  if (idClicked && submitIdClicked) {
    console.log('Both ID and Submit ID clicked, navigating to new page.');
    await page.waitForNavigation(); // انتظر الانتقال إلى الصفحة الجديدة
    console.log('New page URL:', page.url());

    // الآن يمكننا البحث عن العنصر div والنقر عليه في الصفحة الجديدة
    await page.waitForSelector('div'); // انتظر حتى يتم تحميل العنصر div
    await page.click('div'); // قم بالنقر على العنصر div
    console.log('Clicked on div in the new page.');
  } else {
    console.log('ID or Submit ID not clicked, no navigation performed.');
  }

  await browser.close();
})();
