const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://web.facebook.com/r.php';

// Cookies to be added
const cookies = [
    {
        name: 'fr',
        value: '0YBsXEuOmdmgJpQLj.AWW2614tB8FsquGFsP5weUgK4ls.Bl_zFH..AAA.0.0.Bl_zoD.AWU6Zux623A'
    },
    {
        name: 'x-referer',
        value: 'eyJyIjoiL3IucGhwP3NvZnQ9aGprIiwiaCI6Ii9yLnBocD9zb2Z0PWhqayIsInMiOiJtIn0%3D'
    },
    {
        name: 'vpd',
        value: 'v1%3B476x360x3'
    },
    {
        name: 'locale',
        value: 'en_GB'
    },
    {
        name: 'wd',
        value: '980x1410'
    },
    {
        name: 'm_pixel_ratio',
        value: '3.2983407974243164'
    },
    {
        name: 'ps_l',
        value: '0'
    },
    {
        name: 'dpr',
        value: '3.2983407974243164'
    },
    {
        name: 'sb',
        value: 'RzH_ZYW8ihj1KTIIjYEXejDS'
    },
    {
        name: 'ps_n',
        value: '0'
    },
    {
        name: 'wl_cbv',
        value: 'v2%3Bclient_version%3A2447%3Btimestamp%3A1711223362'
    },
    {
        name: 'datr',
        value: 'RzH_ZeRO-TICcYFO4XGe2hSV'
    }
];

async function fetchData(url) {
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Adding cookies
    await page.setCookie(...cookies);

    await page.goto(url);

    await page.waitForSelector('input[name=firstname]');
    await page.type('input[name=firstname]', 'Karim');
    await page.type('input[name=lastname]', 'Al yamani');
    await page.type('input[name=reg_email__]', '+212 605-685904');
    //await page.type('input[name=reg_email_confirmation__]', '+212 605-685904');
    await page.type('input[name=reg_passwd__]', 'Karim2021@11');
    await page.select('select[name=birthday_day]', '1');
    await page.select('select[name=birthday_month]', '1');
    await page.select('select[name=birthday_year]', '1999');

    const content = await page.content();
    const cheriEx = cheerio.load(content);
    let id = '';
    let submitId = '';
    cheriEx('input[id]').each((index, element) => {
        const foundId = cheriEx(element).attr('id');
        if (foundId && foundId.startsWith('u_0_5_')) {
            console.log('Found ID:', foundId);
            id = foundId;
        }
    });

    cheriEx('button[name=websubmit]').each((index, element) => {
        const foundSubmitId = cheriEx(element).attr('id');
        if (foundSubmitId && foundSubmitId.startsWith('u_0_s_')) {
            console.log('Found Submit ID:', foundSubmitId);
            submitId = foundSubmitId;
        }
    });

    if (id !== '' && submitId !== '') {
        await page.click(`#${id}`);
        console.log('Clicked on ID:', id);
        await page.click(`#${submitId}`);
        console.log('Clicked on Submit ID:', submitId);
        await page.waitForNavigation();
        console.log('Navigated to new page:', page.url());
        await page.screenshot({ path: 'screenshot.png', fullPage: true });
        console.log('Screenshot taken.');
    } else {
        console.log('ID or Submit ID not found.');
    }

    await browser.close();
})();
