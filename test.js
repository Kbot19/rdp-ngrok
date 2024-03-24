const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
const whisper = require('whisper');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const model = whisper.load_model('base');

async function transcribe(url) {
    await writeFile('.temp', await promisify(request.get)(url));
    const result = await model.transcribe('.temp');
    return result.text.trim();
}

async function clickCheckbox(page) {
    await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="reCAPTCHA"]');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.getElementById('recaptcha-anchor-label').click();
    });
}

async function requestAudioVersion(page) {
    await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="recaptcha challenge expires in two minutes"]');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.getElementById('recaptcha-audio-button').click();
    });
}

async function solveAudioCaptcha(page) {
    const audioSrc = await page.evaluate(() => {
        const iframe = document.querySelector('iframe[title="recaptcha challenge expires in two minutes"]');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        return iframeDoc.getElementById('audio-source').getAttribute('src');
    });
    const text = await transcribe(audioSrc);
    await page.evaluate((text) => {
        const iframe = document.querySelector('iframe[title="recaptcha challenge expires in two minutes"]');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.getElementById('audio-response').value = text;
        iframeDoc.getElementById('recaptcha-verify-button').click();
    }, text);
}

async function captureScreenshot(page, filename) {
    await page.screenshot({ path: filename });
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.google.com/recaptcha/api2/demo');
    await clickCheckbox(page);
    await setTimeout(async () => {
        await requestAudioVersion(page);
        await setTimeout(async () => {
            await solveAudioCaptcha(page);
            await setTimeout(async () => {
                await page.screenshot({ path: 'screenshot.png', fullPage: true });
            }, 2000); // Adjust the delay as needed
        }, 1000);
    }, 1000);

    await setTimeout(async () => {
        await browser.close();
    }, 10000);
})();
