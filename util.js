const http = require("http");
const https = require("https");
const url = require("url");

// Helper function to normalize a URL to HTTPS
function normalizeUrl(address) {
  // If the URL does not start with 'http://' or 'https://', add 'https://' as the default protocol
  if (!/^https?:\/\//i.test(address)) {
    return `https://${address}`;
  }
  return address;
}

function generateHtmlResponse(titles) {
  return `
              <html>
              <head></head>
              <body>
                <h1>Following are the titles of given websites:</h1>
                <ul>
                  ${titles.join("\n")}
                </ul>
              </body>
              </html>
            `;
}

// Helper function to validate a URL format
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// Function to fetch the title from a given URL using HTTPS
function fetchTitleWithCallback(targetUrl, callback) {
  const normalizedUrl = normalizeUrl(targetUrl);

  if (!isValidUrl(normalizedUrl)) {
    return callback(`<li>${targetUrl} - NO RESPONSE</li>`);
  }

  https.get(normalizedUrl, (res) => {
    // Check for redirection status codes (301 or 302)
    if (res.statusCode === 301 || res.statusCode === 302) {
      const location = res.headers.location;
      console.log(`Redirecting from ${normalizedUrl} to ${location}`);
      return fetchTitleWithCallback(location, callback); // Follow the redirect
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


async function fetchTitleWithPromise(targetUrl) {
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
        resolve(fetchTitleWithPromise(location)); // Follow the redirect
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


module.exports = { fetchTitleWithCallback, normalizeUrl, generateHtmlResponse, fetchTitleWithPromise };
