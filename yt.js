const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-web-security',
      '--disable-dev-shm-usage',
      '--disable-device-emulation', // تعطيل تحاكي الجهاز لكشف الجهاز
      '--disable-device-discovery-notifications' // تعطيل إشعارات اكتشاف الجهاز
    ]
  });

  const page = await browser.newPage();

  // تعيين user agent ليشير إلى iPhone 6 في Safari
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1');

  // تعيين حجم النافذة ليبدو وكأنه في iPhone 6
  await page.setViewport({ width: 375, height: 667 });

  // الذهاب إلى الرابط
  await page.goto('https://m.facebook.com/r.php');

  // انتظار حتى يتم تحميل عنصر معين على الصفحة
  await page.waitForSelector('body');

  // التقاط لقطة شاشة للصفحة بالكامل
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  // لإغلاق المتصفح بعد الانتهاء
  await browser.close();
})();
