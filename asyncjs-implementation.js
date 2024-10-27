const async = require("async");
const https = require("https");

const { generateHtmlResponse, normalizeUrl, isValidUrl } = require("./util");


async function fetchTitle(targetUrl) {
  const normalizedUrl = normalizeUrl(targetUrl);

  if (!isValidUrl(normalizedUrl)) {
    return `<li>${targetUrl} - NO RESPONSE</li>`;
  }

  return new Promise((resolve) => {
    https.get(normalizedUrl, (res) => {
      // Follow redirects for 301 or 302 status codes
      if (res.statusCode === 301 || res.statusCode === 302) {
        const location = res.headers.location;
        console.log(`Redirecting from ${normalizedUrl} to ${location}`);
        resolve(fetchTitle(location)); // Follow the redirect
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          resolve(`<li>${targetUrl} - "${titleMatch[1]}"</li>`);
        } else {
          resolve(`<li>${targetUrl} - NO RESPONSE</li>`);
        }
      });
    }).on('error', () => {
      resolve(`<li>${targetUrl} - NO RESPONSE</li>`);
    });
  });

}


async function fetchTitleWithAsync(urls) {

  // Use async.mapSeries to process each address sequentially
  const results = await async.mapSeries(urls, fetchTitle);
  const htmlResponse = generateHtmlResponse(results)
  return htmlResponse

}

module.exports = fetchTitleWithAsync 
