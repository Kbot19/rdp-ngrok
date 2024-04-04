const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

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

async function getRandomEmail() {
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

const devices = [
  {
    name: 'iPhone SE (2nd generation)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 }
  },
  {
    name: 'iPhone 12 Pro Max',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 428, height: 926 }
  },
  {
    name: 'iPhone 12 Pro',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 }
  },
  {
    name: 'iPhone 12',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 }
  },
  {
    name: 'iPhone 12 mini',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 812 }
  },
  {
    name: 'iPhone 11 Pro Max',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 896 }
  },
  {
    name: 'iPhone 11 Pro',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 812 }
  },
  {
    name: 'iPhone 11',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 896 }
  },
  {
    name: 'iPhone XS Max',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 896 }
  },
  {
    name: 'iPhone XS',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 812 }
  },
  {
    name: 'iPhone XR',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 896 }
  },
  {
    name: 'iPhone X',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 812 }
  },
  {
    name: 'iPhone 8 Plus',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 736 }
  },
  {
    name: 'iPhone 8',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 }
  },
  {
    name: 'iPhone 7 Plus',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 736 }
  },
  {
    name: 'iPhone 7',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 }
  },
  {
    name: 'iPhone SE',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1',
    viewport: { width: 320, height: 568 }
  },
  {
    name: 'iPhone 6s Plus',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 736 }
  },
  {
    name: 'iPhone 6s',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 }
  },
  {
    name: 'iPhone 6 Plus',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 414, height: 736 }
  },
  {
    name: 'iPhone 6',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 }
  },
  {
    name: 'iPhone 5s',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    viewport: { width: 320, height: 568 }
  }
];

    
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-notifications',
      '--disable-web-security',
      '--ignore-certificate-errors',
      '--allow-insecure-localhost',
      '--disable-device-emulation',
      '--disable-device-discovery-notifications',
      '--disable-extensions',
      '--disable-dev-shm-usage',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-client-side-phishing-detection',
      '--disable-default-apps',
      '--disable-hang-monitor',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-sync',
      '--disable-translate',
      '--metrics-recording-only',
      '--safebrowsing-disable-auto-update',
      '--password-store=basic',
      '--use-mock-keychain',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-backgrounding-occluded-windows'
    ]
  });

  const page = await browser.newPage();

  //await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
  
  //await page.setViewport({ width: 320, height: 568 });

  const randomIndex = Math.floor(Math.random() * devices.length);
  const randomDevice = devices[randomIndex];

  await page.setUserAgent(randomDevice.userAgent);
  await page.setViewport(randomDevice.viewport);


  await page.goto('https://m.facebook.com/reg/?is_two_steps_login=0&cid=103&refsrc=deprecated&_rdr');

  await page.waitForSelector('#firstname_input');
  await page.type('#firstname_input', 'karim');

  await page.waitForSelector('#lastname_input');
  await page.type('#lastname_input', 'Elyamani');

  // النقر على زر الإرسال
  await page.click('button[type="submit"][value="Next"]');

  // انتظر لمدة 60 ثانية
  await new Promise(resolve => setTimeout(resolve, 600));

  // تعيين القيمة "Jan" في القائمة المنسدلة لشهر الميلاد
  await page.select('select[name="birthday_month"]', '1');

  // تعيين القيمة "1" في القائمة المنسدلة ليوم الميلاد
  await page.select('select[name="birthday_day"]', '1');

  // تعيين القيمة "1999" في القائمة المنسدلة لسنة الميلاد
  await page.select('select[name="birthday_year"]', '1999');

  await new Promise(resolve => setTimeout(resolve, 6000));

  await page.click('button[type="submit"][value="Next"]');

  //await page.click('input[type="radio"][value="2"][name="sex"]');

  await new Promise(resolve => setTimeout(resolve, 6000));

  await page.click('a[data-sigil="switch_phone_to_email"]');

  await new Promise(resolve => setTimeout(resolve, 600));

  const randomEmailData = await getRandomEmail();
  const randomEmail = randomEmailData.email;

  await page.type('input[name="reg_email__"]', randomEmail);

  await page.click('button[type="submit"][value="Next"]');

  await new Promise(resolve => setTimeout(resolve, 600));

  await page.click('input[type="radio"][value="2"][name="sex"]');

  await page.click('button[type="submit"][value="Next"]');

  await new Promise(resolve => setTimeout(resolve, 600));

  await page.type('input[name=reg_passwd__]', 'Karim2021911@11');

  await page.click('button[type="submit"][value="Sign Up"]');

  await new Promise(resolve => setTimeout(resolve, 60000));

  await page.waitForSelector('body');

  const html = await page.content();

  // حفظ الـ HTML في ملف نصي باسم "fb.html"
  fs.writeFileSync('fb.html', html);
  
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
