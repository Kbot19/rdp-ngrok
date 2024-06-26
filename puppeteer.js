const puppeteer = require("puppeteer");
const axios = require('axios');
const cheerio = require('cheerio');
const { exec } = require("node:child_process")
const { promisify } = require("node:util")

async function fetchData(url) {
  const result = await axios.get(url);
  return cheerio.load(result.data);
}

async function getReceivedEmails(id) {
  const link = `https://dropmail.me/api/graphql/web-test-wgq6m5i?query=query%20(%24id%3A%20ID!)%20%7Bsession(id%3A%24id)%20%7B%20addresses%20%7Baddress%7D%2C%20mails%7BheaderSubject%7D%7D%20%7D&variables=%7B%22id%22%3A%22${id}%22%7D`;

  try {
    const response = await axios.get(link);
    const data = response.data;
    const emails = data['data']['session']['mails'];

    const fbCodes = [];
    emails.forEach(email => {
      const headerSubject = email.headerSubject;
      const fbCode = extractFbCode(headerSubject);
      if (fbCode) {
        fbCodes.push(fbCode);
      }
    });

    return fbCodes;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function extractFbCode(subject) {
  const regex = /FB-(\d+)/;
  const match = subject.match(regex);
  return match ? match[1] : null;
}

async function getRandomEmailData() {
  const link = 'https://dropmail.me/api/graphql/web-test-wgq6m5i?query=mutation%20%7BintroduceSession%20%7Bid%2C%20expiresAt%2C%20addresses%20%7Baddress%7D%7D%7D';

  try {
    const response = await axios.get(link);
    const data = response.data;
    const id = data['data']['introduceSession']['id'];
    const email = data['data']['introduceSession']['addresses'][0]['address'];
    return { id, email };
  } catch (error) {
    console.error(error);
    return null;
  }
}

(async () => {
  const { stdout: chromiumPath } = await promisify(exec)("which chromium")

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: chromiumPath.trim()
  });

  const page = await browser.newPage();
  await page.goto('https://www.facebook.com/r.php');

  await page.waitForSelector('input[name=firstname]');
  await page.type('input[name=firstname]', 'Elina');
  await page.type('input[name=lastname]', 'Parker');
  await page.type('input[name=reg_email__]', '+14252757102');
  await page.type('input[name=reg_passwd__]', 'AlexParker@11');
  await page.select('select[name=birthday_day]', '1');
  await page.select('select[name=birthday_month]', '2');
  await page.select('select[name=birthday_year]', '1991');

  const content = await page.content();
  const cheriEx = cheerio.load(content);
  let id = '';
  let submitId = '';
  cheriEx('input[id]').each((index, element) => {
    const foundId = cheriEx(element).attr('id');
    if (foundId && foundId.startsWith('u_0_4_')) {
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

    const randomEmailData = await getRandomEmailData();
    if (randomEmailData) {
      const randomEmail = randomEmailData.email;
      await page.waitForSelector('input[name="contactpoint"]');
      await page.type('input[name="contactpoint"]', randomEmail);
    } else {
      console.log("Failed to get random email.");
    }

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

    await page.waitForNavigation();

    await new Promise(resolve => setTimeout(resolve, 15000));

    if (randomEmailData) {
      const sessionID = randomEmailData.id;
      const fbCodes = await getReceivedEmails(sessionID);
      if (fbCodes && fbCodes.length > 0) {
        const verificationCode = fbCodes[0];
        await page.waitForSelector('input[name="code"]');
        await page.type('input[name="code"]', verificationCode);
      } else {
        console.log("No verification code received.");
      }
    } else {
      console.log("Failed to get random email.");
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');

    console.log("Email: ", randomEmailData.email);
    console.log("Pwd : AlexParker@11");

    //await new Promise(resolve => setTimeout(resolve, 1500));

    await page.waitForNavigation();

    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.screenshot({ path: 'screenshot.png', fullPage: true });

  } else {
    console.log('ID or Submit ID not found.');
  }

  await browser.close();
})();
