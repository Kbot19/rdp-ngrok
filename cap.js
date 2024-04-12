const apkpure_scraper = require('apkpure-scraper-v1');

apkpure_scraper.apkpure.all('pes').then(result => {
  console.log(result);
}).catch(error => {
  console.error('Error:', error);
});
