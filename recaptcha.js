const { plugin } = require('puppeteer-with-fingerprints');
const axios = require('axios');
const fs = require('fs');
const request = require('request');

(async () => {
  // Get a fingerprint from the server:
  const fingerprint = await plugin.fetch('', {
    tags: ['Microsoft Windows', 'Chrome'],
  });

  // Apply fingerprint:
  plugin.useFingerprint(fingerprint);

  // Launch the browser instance:
  const browser = await plugin.launch();

  // The rest of the code is the same as for a standard `puppeteer` library:
  const page = await browser.newPage();
  await page.goto('https://www.google.com/recaptcha/api2/demo');

  // Print the browser viewport size:
  console.log(
    'Viewport:',
    await page.evaluate(() => ({
      deviceScaleFactor: window.devicePixelRatio,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }))
  );
  console.log('Going to captcha page');
  await new Promise(resolve => setTimeout(resolve, 4000));
  console.log('Page loaded');

  const frame = await page.frames().find((f) => f.name().startsWith('a-'));
  await frame.waitForSelector('div.recaptcha-checkbox-border');
  //click on checkbox to activate recaptcha
  await frame.click('div.recaptcha-checkbox-border');
  console.log('Captcha exists!');

  // Switch to the new iframe for the challenge
  //await page.waitForTimeout(3000); // Wait for new iframe to load
  await new Promise(resolve => setTimeout(resolve, 3000));


  // Find the iframe by its XPath
  /*const iframeElementHandle = await page.$x(
    ".//iframe[@title='recaptcha challenge expires in two minutes']",
  );*/

  const iframeElementHandle = await page.evaluateHandle(() => {
    return document.evaluate(".//iframe[@title='recaptcha challenge expires in two minutes']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
});


  // Get the frame from the element handle
  const secondaryIframe = await iframeElementHandle.contentFrame();
  await secondaryIframe.waitForSelector('#recaptcha-audio-button');
  await secondaryIframe.click('#recaptcha-audio-button');
  /*await secondaryIframe.waitForSelector('.rc-button-audio');
  await secondaryIframe.click('.rc-button-audio');*/
  console.log('Audio button clicked');
  await new Promise(resolve => setTimeout(resolve, 15000));
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  await browser.close();
})();
