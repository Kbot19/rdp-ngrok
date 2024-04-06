const axios = require('axios');
const MAX_RETRIES = 5; // تعيين عدد محاولات إعادة المحاولة
let retries = 0;

async function sendRequests() {
  const url = 'https://massar.men.gov.ma'; // تم تغيير الرابط هنا
  const requestsCount = 10000;

  console.log('بدء إرسال الطلبات...');

  for (let i = 0; i < requestsCount; i++) {
    await retry(url, i + 1);
  }
}

async function retry(url, index) {
  try {
    await axios.get(url);
    console.log(`تم إرسال الطلب رقم ${index}`);
    retries = 0; // إعادة تهيئة عدد محاولات إعادة المحاولة بعد النجاح
  } catch (error) {
    console.error(`حدث خطأ أثناء إرسال الطلب رقم ${index}: ${error.message}`);
    if (retries < MAX_RETRIES) {
      console.log(`جاري إعادة محاولة إرسال الطلب رقم ${index}...`);
      retries++;
      await retry(url, index); // إعادة محاولة إرسال الطلب
    } else {
      console.error(`تم رفض الطلب بعد ${MAX_RETRIES} محاولات`);
      process.exit(1); // إيقاف التنفيذ بعد عدد معين من محاولات إعادة المحاولة
    }
  }
}

sendRequests();
