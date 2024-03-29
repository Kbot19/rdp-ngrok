const puppeteer = require("puppeteer");
const axios = require('axios');
const cheerio = require('cheerio');
const { exec } = require("node:child_process")
const { promisify } = require("node:util")

async function fetchData(url) {
  const result = await axios.get(url);
  return cheerio.load(result.data);
}

async function getReceivedEmails(id) {
  const link = `https://dropmail.me/api/graphql/web-test-wgq6m5i?query=query%20(%24id%3A%20ID!)%20%7Bsession(id%3A%24id)%20%7B%20addresses%20%7Baddress%7D%2C%20mails%7BheaderSubject%7D%7D%20%7D&variables=%7B%22id%22%3A%22${id}%22%7D`;

  try {
    const response = await axios.get(link);
    const data = response.data;
    const emails = data['data']['session']['mails'];

    const fbCodes = [];
    emails.forEach(email => {
      const headerSubject = email.headerSubject;
      const fbCode = extractFbCode(headerSubject);
      if (fbCode) {
        fbCodes.push(fbCode);
      }
    });

    return fbCodes;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function extractFbCode(subject) {
  const regex = /FB-(\d+)/;
  const match = subject.match(regex);
  return match ? match[1] : null;
}

async function getRandomEmailData() {
  const link = 'https://dropmail.me/api/graphql/web-test-wgq6m5i?query=mutation%20%7BintroduceSession%20%7Bid%2C%20expiresAt%2C%20addresses%20%7Baddress%7D%7D%7D';
