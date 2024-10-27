const https = require("https");
const { normalizeUrl, isValidUrl, generateHtmlResponse } = require('./util');


// Function to fetch the title from a given URL using HTTPS
function fetchTitle(targetUrl, callback) {
  const normalizedUrl = normalizeUrl(targetUrl);

  if (!isValidUrl(normalizedUrl)) {
    return callback(`<li>${targetUrl} - NO RESPONSE</li>`);
  }

  https.get(normalizedUrl, (res) => {
    // Check for redirection status codes (301 or 302)
    if (res.statusCode === 301 || res.statusCode === 302) {
      const location = res.headers.location;
      console.log(`Redirecting from ${normalizedUrl} to ${location}`);
      return fetchTitle(location, callback); // Follow the redirect
    }

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        callback(`<li>${targetUrl} - "${titleMatch[1]}"</li>`);
      } else {
        callback(`<li>${targetUrl} - NO RESPONSE</li>`);
      }
    });
  }).on('error', (err) => {
    callback(`<li>${targetUrl} - NO RESPONSE</li>`);
  });
}



function fetchTitleWithCallback(urls, cb) {
  let results = [];
  let completedRequests = 0;
  let htmlResponse = ``
  urls.forEach((url, index) => {
    fetchTitle(url, (result) => {
      results[index] = result;  // Store each result in the correct index
      completedRequests += 1;
      if (completedRequests === urls.length) {
        htmlResponse = generateHtmlResponse(results)
        cb(htmlResponse)
      }
    });
  });
  return htmlResponse
}

module.exports = fetchTitleWithCallback 