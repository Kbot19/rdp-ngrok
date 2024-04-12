const apkpure = require('./test.js');

async function searchAndRetrieveAppInfo(query) {
    try {
        const appInfo = await apkpure(query);
        console.log(appInfo);
    } catch (error) {
        console.error('Error:', error);
    }
}

searchAndRetrieveAppInfo('8 ball pool');
