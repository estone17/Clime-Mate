// Import the http module
const http = require('http');

// Define the hostname and port for the server
const hostname = '127.0.0.1'; // localhost
const port = 3000;

// Create the server
const server = http.createServer((req, res) => {
  // Set the response status code and headers
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  // Send the response body
  res.end('Hello, World!\n');
});

// Start the server and listen on the specified port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


//database values
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "group",
  password: "GroupPass123"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});