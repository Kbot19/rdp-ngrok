const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
  let pageCount = 0;
  let openPageCount = 0;
  const refreshFrequency = 5;

  for (let i = 0; i < 50000; i++) {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 414, height: 896 }); // Viewport for iPhone 12 Pro Max

    setTimeout(async () => {
      await page.goto('https://massar.men.gov.ma');
      openPageCount++;
      console.log(`عدد الصفحات المفتوحة: ${openPageCount}`);

      if (openPageCount % refreshFrequency === 0) {
        console.log(`تحديث ${refreshFrequency} صفحات`);
        const pages = await browser.pages();
        for (const page of pages) {
          try {
            await page.reload({ waitUntil: 'networkidle0' }); // تحديث الصفحة وانتظر حتى تنتهي الشبكة من النشاط
          } catch (error) {
            console.error('حدث خطأ أثناء إعادة تحميل الصفحة:', error);
          }
        }
      }
    }, i * 10000); // تحديد فاصل زمني بين فتح كل صفحة جديدة

    pageCount++;
  }

  setInterval(() => {
    console.log(`عدد الصفحات المفتوحة: ${openPageCount}`);
  }, 1000);
})();
