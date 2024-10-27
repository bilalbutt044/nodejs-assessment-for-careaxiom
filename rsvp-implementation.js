const https = require("https");
const RSVP = require("rsvp");

const { generateHtmlResponse, normalizeUrl, isValidUrl } = require("./util");


// Fetch the title from a given URL
function fetchTitle(targetUrl) {
  const normalizedUrl = normalizeUrl(targetUrl);

  if (!isValidUrl(normalizedUrl)) {
    return RSVP.resolve(`<li>${targetUrl} - NO RESPONSE</li>`);
  }

  return new RSVP.Promise((resolve) => {
    https.get(normalizedUrl, (res) => {
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

async function fetchTitleWithRsvp(urls) {
  const results = await RSVP.all(urls.map(fetchTitle));
  const htmlResponse = generateHtmlResponse(results);
  return htmlResponse
}

module.exports = fetchTitleWithRsvp


