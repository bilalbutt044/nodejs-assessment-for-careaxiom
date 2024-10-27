const http = require('http');
const url = require('url');
const { fetchTitle } = require('./callback-implementation');
const fetchTitleWithAsync = require('./asyncjs-implementation');
const fetchTitleWithRsvp = require('./rsvp-implementation');
// const { fetchTitleWithCallback, generateHtmlResponse } = require('./util');

// Define the hostname and port
const hostname = '127.0.0.1';
const port = 3000;

// Create the server to accept HTTP requests
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  let htmlResponse = []

  if (pathname === '/I/want/title' || pathname === '/I/want/title/') {
    if (query.address) {
      const addresses = Array.isArray(query.address) ? query.address : [query.address];
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');


      // callback implementation
      // fetchTitle(addresses, (htmlResponse) => {
      //   res.end(htmlResponse)
      // })


      // async.js implementation
      // try {
      //   htmlResponse = await fetchTitleWithAsync(addresses)
      //   res.end(htmlResponse)
      // } catch (err) {
      //   res.writeHead(500, { 'Content-Type': 'text/html' });
      //   res.end('<h1>Error occurred while fetching titles</h1>');
      // }


      // RSVP.js implementation
      try {
        htmlResponse = await fetchTitleWithRsvp(addresses)
        res.end(htmlResponse)
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Error occurred while fetching titles</h1>');
      }

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
