const http = require('http');
const url = require('url');
const { fetchTitle } = require('./callback-implementation');
// const { fetchTitleWithCallback, generateHtmlResponse } = require('./util');

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
      let completedRequests = 0;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');

      // callback implementation
      fetchTitle(addresses, (htmlResponse) => {
        res.end(htmlResponse)
      })


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
