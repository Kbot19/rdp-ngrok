const puppeteer = require('puppeteer');

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

  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1');

  await page.setViewport({ width: 375, height: 667 });

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

  await page.click('button[type="submit"][value="Next"]');

  await new Promise(resolve => setTimeout(resolve, 6000));

  //await page.click('button[type="submit"][value="Next"]');

  //await page.click('input[type="radio"][value="2"][name="sex"]');

  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
