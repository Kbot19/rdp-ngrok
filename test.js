const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const whisper = require('whisper');

// Add Stealth plugin
puppeteer.use(stealthPlugin());

const url = 'https://www.facebook.com/r.php';

async function fetchData(url) {
  const result = await axios.get(url);
  return cheerio.load(result.data);
}

async function solveCaptcha(audioSrc) {
  const audioContent = await axios.get(audioSrc, { responseType: 'arraybuffer' });
  fs.writeFileSync('.temp.mp3', Buffer.from(audioContent.data));
  const result = await whisper.transcribe('.temp.mp3');
  return result.text.trim();
}


(async () => {
  const browser = await puppeteer.launch({ 
    headless: true
    //args: [`--proxy-server=105.154.112.134:57304`]
  });

  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('input[name=firstname]');
  await page.type('input[name=firstname]', 'Karim');
  await page.type('input[name=lastname]', 'Elyamani');
  await page.type('input[name=reg_email__]', '+1 (425) 475-7001');
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
      id = foundId;
    }
  });

  cheriEx('button[name=websubmit]').each((index, element) => {
    const foundSubmitId = cheriEx(element).attr('id');
    if (foundSubmitId && foundSubmitId.startsWith('u_0_s_')) {
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

    await page.evaluate((submitId) => {
      const element = document.getElementById(submitId);
      if (element) {
        element.click();
      } else {
        throw new Error(`Element with ID ${submitId} not found.`);
      }
    }, submitId);

    await new Promise(resolve => setTimeout(resolve, 300));

    await page.waitForNavigation();

    /*await page.waitForSelector('div[aria-label="Continue"]');
    await page.evaluate(() => {
      const continueButton = document.querySelector('div[aria-label="Continue"]');
      if (continueButton) {
        continueButton.click();
      } else {
        throw new Error('Continue button not found.');
      }
    });*/

    await page.waitForSelector('div');
    await page.evaluate(() => {
      const div = document.querySelector('div');
      if (div) {
        div.click();
      } else {
        throw new Error('Div element not found.');
      }
    });

    await page.waitForSelector('a[href*="/change_contactpoint/dialog"]');
    await page.click('a[href*="/change_contactpoint/dialog"]');


    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.waitForSelector('input[name="contactpoint"]');
    await page.type('input[name="contactpoint"]', '7cqyh2zw@mailpwr.com');

    await page.waitForSelector('button[type="submit"]');

    const addButtonId = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button[type="submit"]');
    for (const button of buttons) {
    if (button.innerText === 'Add') {
      return button.id;
    }
    }
    });
    
    if (addButtonId) {
      await page.click(`#${addButtonId}`);
    } else {
      console.log('Could not find the Add button ID.');
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.waitForNavigation();

    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.waitForSelector('input[name="code"]');

    await page.type('input[name="code"]', '43719');

    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.waitForSelector('button[type="submit"]');
    
    await page.click('button[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 1500));

    /*await page.waitForNavigation();

    await new Promise(resolve => setTimeout(resolve, 1500));*/

    /*const cheerioHtml = await page.evaluate(() => {
    return document.documentElement.outerHTML;
    });
    fs.writeFileSync('fb.html', cheerioHtml);*/

    await page.screenshot({ path: 'screenshot.png', fullPage: true });

  } else {
    console.log('ID or Submit ID not found.');
  }

  await browser.close();
})();
