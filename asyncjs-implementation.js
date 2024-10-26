const http = require('http');
const url = require('url');
const async = require("async")


const { fetchTitle, generateHtmlResponse } = require('./util');

// Define the hostname and port
const hostname = '127.0.0.1';
const port = 3000;

// Create the server to accept HTTP requests
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/I/want/title' || pathname === '/I/want/title/') {
    if (query.address) {
      const addresses = Array.isArray(query.address) ? query.address : [query.address];
      let results = [];
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');

      async.eachSeries(addresses, (address, cb) => {
        fetchTitle(address, (htmlResponse) => {
          results.push(htmlResponse); // Store result
          cb(); // Call the callback to move to the next address
        });
      }, (err) => {
        // Final callback after all addresses have been processed
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end('<h1>Error occurred while fetching titles</h1>');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          const htmlResponse = generateHtmlResponse(results)
          res.end(htmlResponse);
        }
      });
    } else {
      res.statusCode = 400;
      res.end('<html><body><h1>Please provide at least one address query parameter.</h1></body></html>');
    }
  } else {
    res.statusCode = 404;
    res.end('<html><body><h1>No route found</h1></body></html>');
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`HTTP server running at http://${hostname}:${port}/`);
});
