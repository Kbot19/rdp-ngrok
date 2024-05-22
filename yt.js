const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// رابط الصفحة التي تحتوي على الفيديو
const pageUrl = 'https://stream.fushaar.link/movie/22023/22023.mp4?wmsAuthSign=c2VydmVyX3RpbWU9NS8yMi8yMDI0IDM6Mzk6NTEgUE0maGFzaF92YWx1ZT1PWlZMdFFkbEpzeldzcmJqcUg4ZmVnPT0mdmFsaWRtaW51dGVzPTQ1MA==&nimblesessionid=138843680';

axios.get(pageUrl)
  .then(response => {
    const $ = cheerio.load(response.data);

    // استخراج رابط الفيديو من العنصر <source>
    const videoUrl = $('video source').attr('src');
    if (videoUrl) {
      // اسم الملف الذي سيتم حفظ الفيديو به
      const videoFileName = path.basename(videoUrl.split('?')[0]);

      // تحميل الفيديو
      axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
      }).then(response => {
        const videoFilePath = path.resolve(__dirname, videoFileName);
        const writer = fs.createWriteStream(videoFilePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
          console.log(`Video saved as ${videoFileName}`);
        });

        writer.on('error', (err) => {
          console.error('Error writing the video file:', err);
        });
      }).catch(err => {
        console.error('Error downloading the video:', err);
      });
    } else {
      console.error('No video source found on the page');
    }
  })
  .catch(err => {
    console.error('Error fetching the page:', err);
  });
