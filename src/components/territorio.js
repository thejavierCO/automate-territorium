const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');axiosCookieJarSupport(axios);
const {CookieJar,Cookie} = tough;
const cookieJar = new CookieJar;
const cheerio = require('cheerio');

module.exports = {};