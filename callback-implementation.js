const { normalizeUrl, isValidUrl, generateHtmlResponse, fetchTitleWithCallback } = require('./util');

function fetchTitle(urls, cb) {
  let results = [];
  let completedRequests = 0;
  let htmlResponse = ``
  urls.forEach((url, index) => {
    fetchTitleWithCallback(url, (result) => {
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

module.exports = { fetchTitle }