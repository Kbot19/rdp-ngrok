const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--window-size=800,600', '--no-sandbox', '--disable-setuid-sandbox', '--disable-infobars', '--disable-web-security', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  // تعيين user agent ليكون كهاتف Android
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Mobile Safari/537.36');

  // الذهاب إلى الرابط
  await page.goto('https://m.facebook.com/r.php');

  // انتظار حتى يتم تحميل عنصر معين على الصفحة
  await page.waitForSelector('body');

  // التقاط لقطة شاشة للصفحة بالكامل
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  // لإغلاق المتصفح بعد الانتهاء
  await browser.close();
})();
