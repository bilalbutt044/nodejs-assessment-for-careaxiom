const http = require("http");
const https = require("https");
const url = require("url");
const RSVP = require('rsvp');

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










module.exports = { isValidUrl, normalizeUrl, generateHtmlResponse };
