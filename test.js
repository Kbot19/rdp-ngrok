const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const whisper = require('whisper');

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
  //args: [`--proxy-server=102.50.252.231:8181`]
});

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

    await page.waitForSelector('div[aria-label="Continue"]');
    await page.evaluate(() => {
      const continueButton = document.querySelector('div[aria-label="Continue"]');
      if (continueButton) {
        continueButton.click();
      } else {
        throw new Error('Continue button not found.');
      }
    });

    await page.waitForSelector('div');
    await page.evaluate(() => {
      const div = document.querySelector('div');
      if (div) {
        div.click();
      } else {
        throw new Error('Div element not found.');
      }
    });
    
    const recaptchaAnchorLabel = cheriEx('#recaptcha-anchor-label'); // البحث عن العنصر بالـ id
if (recaptchaAnchorLabel.length > 0) { // التأكد من وجود العنصر
    console.log('Recaptcha Anchor Label Element:', recaptchaAnchorLabel.html()); // طباعة العنصر
} else {
    console.log('Recaptcha Anchor Label Element not found.');
}



    
    await new Promise(resolve => setTimeout(resolve, 500));

    /*await page.waitForSelector('.recaptcha-checkbox-checkmark');
    const checkbox = await page.$('.recaptcha-checkbox-checkmark');
    await checkbox.click();*/



    await new Promise(resolve => setTimeout(resolve, 15000));
      

    /*await page.waitForSelector('#recaptcha-audio-button');
    await page.click('#recaptcha-audio-button');

    await page.waitForSelector('#audio-source');
    const audioSrc = await page.$eval('#audio-source', source => source.getAttribute('src'));
    const captchaText = await solveCaptcha(audioSrc);
    await page.type('#audio-response', captchaText);
    await page.click('#recaptcha-verify-button');*/

    await page.screenshot({ path: 'screenshot.png', fullPage: true });

  } else {
    console.log('ID or Submit ID not found.');
  }

  await browser.close();
})();
