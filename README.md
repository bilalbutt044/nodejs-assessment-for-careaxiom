# URL Title Fetcher

This project fetches webpage titles from URLs provided as query parameters. The implementations demonstrate three different asynchronous methods: **callbacks**, **async.js**, and **RSVP promises**. Each method can be tested by uncomment the code in server.js file.


---

## Running the Server

1. **Install dependencies**:

   ```bash
   npm install

## Start the server:
```
nodemon server.js
```
## Testing Different Implementations
To switch between implementations, uncomment the code in server.js file

```
   // callback implementation
      fetchTitleWithCallback(addresses, (htmlResponse) => {
        res.end(htmlResponse)
      })


      // uncomment below code to run async.js implementation
      // try {
      //   htmlResponse = await fetchTitleWithAsync(addresses)
      //   res.end(htmlResponse)
      // } catch (err) {
      //   res.writeHead(500, { 'Content-Type': 'text/html' });
      //   res.end('<h1>Error occurred while fetching titles</h1>');
      // }


      // uncooment below code to run RSVP.js implementation
      // try {
      //   htmlResponse = await fetchTitleWithRsvp(addresses)
      //   res.end(htmlResponse)
      // } catch (err) {
      //   res.writeHead(500, { 'Content-Type': 'text/html' });
      //   res.end('<h1>Error occurred while fetching titles</h1>');
      // }

```
