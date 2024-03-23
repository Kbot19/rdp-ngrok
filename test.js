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
  await page.type('input[name=reg_email__]', '+212 605-685904'); // تعديل الرقم هنا
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
    await page.evaluate((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.click();
      } else {
        throw new Error(`Element with ID ${id} not found.`);
      }
    }, id);
    console.log('Clicked on ID:', id);

    await page.evaluate((submitId) => {
      const element = document.getElementById(submitId);
      if (element) {
        element.click();
      } else {
        throw new Error(`Element with ID ${submitId} not found.`);
      }
    }, submitId);
    console.log('Clicked on Submit ID:', submitId);

    // انتظر حتى يظهر الزر "Continue" والنقر عليه
    await page.waitForSelector('div[aria-label="Continue"]');
    await page.evaluate(() => {
      const continueButton = document.querySelector('div[aria-label="Continue"]');
      if (continueButton) {
        continueButton.click();
      } else {
        throw new Error('Continue button not found.');
      }
    });
    console.log('Clicked on Continue.');

    // انتظر حتى يظهر ال div والنقر عليه
    await page.waitForSelector('div');
    await page.evaluate(() => {
      const div = document.querySelector('div');
      if (div) {
        div.click();
      } else {
        throw new Error('Div element not found.');
      }
    });
    console.log('Clicked on div.');

    await page.waitForTimeout(60000); // انتظر لمدة 60 ثانية

    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log('Screenshot taken.');
  } else {
    console.log('ID or Submit ID not found.');
  }

  await browser.close();
})();
